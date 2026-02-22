import Peer, { type PeerOptions, type DataConnection } from 'peerjs';
import * as Protocol from './protocol';
import { hashFile } from './utils';
import type { SenderFile, FileId, ReceiverFile } from './types';
import { session } from './session.svelte';
import { SvelteMap } from 'svelte/reactivity';
import * as Registry from '../routes/registry/registry.remote';

export const defaultPeerOptions: PeerOptions = {
	host: 'localhost',
	port: 9000,
	path: '/myapp',
	debug: 1
};

export function createPeer(options?: Partial<PeerOptions>) {
	return new Peer({ ...defaultPeerOptions, ...(options ?? {}) });
}

export function setupSender(peer: Peer) {
	peer.on('open', (id) => {
		session.peerId = id;
	});

	peer.on('connection', (conn) => {
		session.role = 'sender';
		session.conn = conn;
		session.connected = true;

		conn.on('open', () => {
			const files = Array.from(session.senderFiles.entries()).map(([id, f]) => ({
				id,
				name: f.name,
				size: f.size,
				type: f.file.type,
				hash: f.hash
			}));
			Protocol.sendMetadata(conn, files);
		});

		conn.on('data', (data) => handleIncoming(conn, data));
		conn.on('close', () => {
			session.connected = false;
			session.conn = null;
		});
		conn.on('error', (err) => console.error(err));
	});
}

const CHUNK_SIZE = 16 * 1024;

export async function sendFile(conn: DataConnection, fileId: FileId, senderFile: SenderFile) {
	const { file } = senderFile;
	let offset = 0;
	while (offset < file.size) {
		const buffer = await file.slice(offset, offset + CHUNK_SIZE).arrayBuffer();
		Protocol.sendChunk(conn, fileId, buffer);
		offset += CHUNK_SIZE;
	}
}

export function handleIncoming(conn: DataConnection, data: unknown) {
	if (!Protocol.isMessage(data)) return;
	handleMessage(conn, data);
}

export async function setupReceiver(peer: Peer, code?: string) {
	if (!code) return;
	try {
		const remoteId = await Registry.lookup(code);
		if (!remoteId) return;
		const c = peer.connect(remoteId);
		session.conn = c;
		c.on('open', () => {
			session.connected = true;
			c.on('data', (data) => handleIncoming(c, data));
		});
		c.on('close', () => {
			session.connected = false;
			session.conn = null;
		});
		c.on('error', (err) => console.error(err));
	} catch (err) {
		console.error('setupReceiver failed', err);
	}
}

function handleMessage(conn: DataConnection, message: Protocol.Message) {
	switch (message.type) {
		case Protocol.MessageType.Metadata: {
			const receiverFiles = new SvelteMap<string, ReceiverFile>();
			for (const [fileId, fileData] of Object.entries(message.files)) {
				receiverFiles.set(fileId, {
					...fileData,
					receivedBytes: 0,
					chunks: []
				});
			}
			session.receiverFiles = receiverFiles;
			break;
		}
		case Protocol.MessageType.Progress: {
			const file = session.receiverFiles.get(message.fileId);
			if (!file) return;
			file.receivedBytes = message.bytesReceived;
			break;
		}
		case Protocol.MessageType.Chunk: {
			receiveChunk(conn, message.fileId, message.chunk);
			break;
		}
		case Protocol.MessageType.Complete: {
			break;
		}
		case Protocol.MessageType.Cancel: {
			session.receiverFiles.delete(message.fileId);
			break;
		}
		case Protocol.MessageType.Error: {
			console.error(`[${message.fileId}] ${message.code}: ${message.message}`);
			break;
		}
		case Protocol.MessageType.Ping: {
			Protocol.sendPong(conn, message.timestamp);
			break;
		}
		case Protocol.MessageType.Pong: {
			break;
		}
		case Protocol.MessageType.Request: {
			const file = session.senderFiles.get(message.fileId);
			if (!file) return;
			sendFile(conn, message.fileId, file);
			break;
		}
	}
}

async function receiveChunk(conn: DataConnection, fileId: string, chunk: ArrayBuffer) {
	const file = session.receiverFiles.get(fileId);
	if (!file) return;

	file.chunks.push(chunk);
	file.receivedBytes += chunk.byteLength;

	if (file.receivedBytes < file.size) {
		Protocol.sendProgress(conn, fileId, file.receivedBytes, file.size);
		return;
	}

	const blob = new Blob(file.chunks);
	const assembledFile = new File([blob], file.name);
	const hash = await hashFile(assembledFile);

	if (hash === file.hash) {
		Protocol.sendComplete(conn, fileId, hash);
		file.file = assembledFile;
		console.log('[P2P] File received:', file);
	} else {
		console.error('[P2P] Checksum mismatch:', hash, '!=', file.hash);
		Protocol.sendError(conn, fileId, 'CHECKSUM_MISMATCH', 'File integrity check failed');
	}
}
