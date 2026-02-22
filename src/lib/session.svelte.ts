import { createPeer, handleIncoming } from './peer';
import type { DataConnection } from 'peerjs';
import { type SenderFileMap, type ReceiverFileMap } from './types';
import { SvelteMap } from 'svelte/reactivity';
import { sendMetadata } from './protocol';

export const session = $state({
	peerId: '',
	code: '',
	conn: null as DataConnection | null,
	connected: false,
	role: null as 'sender' | 'receiver' | null,
	senderFiles: new SvelteMap() as SenderFileMap,
	receiverFiles: new SvelteMap() as ReceiverFileMap
});

export const peer = createPeer();

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
		sendMetadata(conn, files);
	});

	conn.on('data', (data) => handleIncoming(conn, data));
	conn.on('close', () => {
		session.connected = false;
		session.conn = null;
	});
	conn.on('error', (err) => console.error(err));
});
