import { SvelteMap } from 'svelte/reactivity';
import { createPeer, handleIncoming } from './peer';
import type { DataConnection } from 'peerjs';
import { type Transfer } from './protocol';

export const session = $state({
	conn: null as DataConnection | null,
	connected: false,
	code: '',
	peerId: '',
	transfers: new SvelteMap<string, Transfer>(), // TODO: need to clean this up
	pendingFiles: new SvelteMap<string, File>(),
});

export const peer = createPeer();

peer.on('open', (id) => {
	session.peerId = id;
});

peer.on('connection', (incomingConn: DataConnection) => {
	session.conn = incomingConn;
	session.connected = true;
	incomingConn.on('data', (data) => handleIncoming(incomingConn, data));
	incomingConn.on('close', () => {
		session.connected = false;
		session.conn = null;
	});
	incomingConn.on('error', (err) => console.error(err));
});
