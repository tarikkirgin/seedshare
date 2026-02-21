import Peer, { type PeerOptions, type DataConnection } from 'peerjs';
import * as Protocol from './protocol';
import { hashFile } from './utils';
import type { SvelteMap } from 'svelte/reactivity';

export const defaultPeerOptions: PeerOptions = {
	host: 'localhost',
	port: 9000,
	path: '/myapp',
	debug: 1
};

export function createPeer(options?: Partial<PeerOptions>) {
	const opts: PeerOptions = { ...defaultPeerOptions, ...(options ?? {}) };
	return new Peer(opts);
}

const CHUNK_SIZE = 16 * 1024;

export async function sendFile(conn: DataConnection, file: File) {
	const checksum = await hashFile(file);
	const transferId = crypto.randomUUID();

	Protocol.sendMetadata(conn, transferId, {
		fileName: file.name,
		fileSize: file.size,
		fileType: file.type,
		checksum: checksum
	});

	let offset = 0;
	while (offset < file.size) {
		const slice = file.slice(offset, offset + CHUNK_SIZE);
		const buffer = await slice.arrayBuffer();

		Protocol.sendData(conn, transferId, { chunk: buffer });

		offset += CHUNK_SIZE;
	}
}

export interface Transfer {
	fileName: string;
	fileSize: number;
	chunks: ArrayBuffer[];
	receivedBytes: number;
	checksum: string;
	completedFile?: File;
}

export function handleIncoming(
	conn: DataConnection,
	transfers: SvelteMap<string, Transfer>,
	data: unknown
) {
	if (!conn) return;
	if (Protocol.isMessage(data)) {
		handleMessage(conn, transfers, data);
	}
}

function handleMessage(
	conn: DataConnection,
	transfers: SvelteMap<string, Transfer>,
	message: Protocol.Message
) {
	const { transferId } = message;

	switch (message.type) {
		case Protocol.MessageType.Metadata: {
			const transfer: Transfer = {
				fileName: message.data.fileName,
				fileSize: message.data.fileSize,
				chunks: [],
				receivedBytes: 0,
				checksum: message.data.checksum
			};

			transfers.set(transferId, transfer);
			break;
		}

		case Protocol.MessageType.Progress: {
			const state = transfers.get(transferId);
			if (state) state.receivedBytes = message.data.bytesReceived;
			break;
		}

		case Protocol.MessageType.Data:
			receiveChunk(conn, transfers, transferId, message.data.chunk);
			break;

		case Protocol.MessageType.Complete: {
			break;
		}

		case Protocol.MessageType.Cancel:
			break;

		case Protocol.MessageType.Error:
			console.error(`[${transferId}] ${message.data.code}: ${message.data.message}`);
			break;

		case Protocol.MessageType.Ping:
			Protocol.sendPong(conn, transferId, { timestamp: message.data.timestamp });
			break;

		case Protocol.MessageType.Pong:
			break;
	}
}

async function receiveChunk(
	conn: DataConnection,
	transfers: SvelteMap<string, Transfer>,
	transferId: string,
	chunk: ArrayBuffer
) {
	const transfer = transfers.get(transferId);
	if (!transfer) return;

	const updated: Transfer = {
		...transfer,
		chunks: [...transfer.chunks, chunk],
		receivedBytes: transfer.receivedBytes + chunk.byteLength
	};

	transfers.set(transferId, updated);

	if (updated.receivedBytes >= updated.fileSize) {
		Protocol.sendComplete(conn, transferId, { checksum: updated.checksum });
		const blob = new Blob(updated.chunks);
		const file = new File([blob], updated.fileName);
		const fileChecksum = await hashFile(file);
		if (fileChecksum === updated.checksum) {
			const completedTransfer: Transfer = {
				...updated,
				completedFile: file
			};
			transfers.set(transferId, completedTransfer);
			console.log('[P2P] File received:', file);
		} else {
			console.error('[P2P] File checksum mismatch:', fileChecksum, '!=', updated.checksum);
		}
	}
}
