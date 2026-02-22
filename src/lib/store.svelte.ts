import { SvelteMap } from 'svelte/reactivity';
import { createPeer, handleIncoming } from './peer';
import type { DataConnection } from 'peerjs';
import type { Transfer } from './peer';

export const transfers = new SvelteMap<string, Transfer>();

export const peerState = $state({
  conn: null as DataConnection | null,
  connected: false,
  code: '',
  peerId: '',
  pendingFiles: null as File[] | null,
});

export const peer = createPeer();

peer.on('open', (id) => {
  peerState.peerId = id;
});

peer.on('connection', (incomingConn: DataConnection) => {
  peerState.conn = incomingConn;
  peerState.connected = true;
  incomingConn.on('data', (data) => handleIncoming(incomingConn, transfers, data));
  incomingConn.on('close', () => { peerState.connected = false; peerState.conn = null; });
  incomingConn.on('error', (err) => console.error(err));
});
