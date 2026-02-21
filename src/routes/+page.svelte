<script lang="ts">
	import { type DataConnection } from 'peerjs';
	import { type Transfer, createPeer, handleIncoming, sendFile } from '$lib/peer';
	import { SvelteMap } from 'svelte/reactivity';
	import * as Registry from './registry/registry.remote';

	let transfers = new SvelteMap<string, Transfer>();

	let code = '';
	let remoteCode = '';

	const peer = createPeer();
	let peerId = '';
	let conn: DataConnection | null = null;
	let remoteId = '';
	let connected = false;

	peer.on('open', (id) => {
		peerId = id;
		console.log('[P2P] Peer opened with ID:', peerId);
	});

	peer.on('connection', (incomingConn: DataConnection) => {
		console.log('[P2P] Incoming connection from:', incomingConn.peer);
		conn = incomingConn;
		connected = true;

		incomingConn.on('data', (data) => handleIncoming(incomingConn, transfers, data));
		incomingConn.on('close', () => {
			console.warn('[P2P] Connection closed');
			connected = false;
			conn = null;
		});
		incomingConn.on('error', (err) => console.error('[P2P] Connection error:', err));
	});

	async function register() {
		if (!peerId) return;
		console.log('[P2P] Registering...');
		code = await Registry.register(peerId);
		console.log('[P2P] Registered. Code:', code);
	}

	async function connect() {
		if (!remoteCode) return;

		remoteId = await Registry.lookup(remoteCode);
		if (!remoteId) {
			console.error('[P2P] Could not resolve code');
			return;
		}

		const c = peer.connect(remoteId);
		conn = c;

		c.on('open', () => {
			console.log('[P2P] Connected to remote peer:', remoteId);
			connected = true;
			c.on('data', (data) => handleIncoming(c, transfers, data));
		});

		c.on('close', () => {
			console.warn('[P2P] Connection closed');
			connected = false;
			conn = null;
		});

		c.on('error', (err) => console.error('[P2P] Connection error:', err));
	}

	async function doSendFile() {
		if (!conn) return;

		const input = document.querySelector('input[type="file"]') as HTMLInputElement;
		const file = input?.files?.[0];
		if (!file) return;

		console.log(`[P2P] Sending file: ${file.name}`);
		await sendFile(conn, file);
	}

	function downloadFile(file: File | undefined) {
		if (!file) {
			return;
		}
		const url = URL.createObjectURL(file);
		const a = document.createElement('a');
		a.href = url;
		a.download = file.name;
		document.body.appendChild(a);
		a.click();
	}
</script>

<main class="mx-auto max-w-md space-y-6 rounded bg-gray-50 p-4 shadow">
	<section class="space-y-2">
		<h2 class="text-lg font-semibold">Register Peer</h2>
		<div class="flex gap-2">
			<button
				class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
				on:click={register}
			>
				Register
			</button>
			<p class="flex items-center">Code: <span class="ml-2 font-mono">{code}</span></p>
		</div>
	</section>

	<section class="space-y-2">
		<h2 class="text-lg font-semibold">Connect to Remote Peer</h2>
		<div class="flex gap-2">
			<input
				bind:value={remoteCode}
				placeholder="Remote code"
				class="flex-1 rounded border px-2 py-1"
			/>
			<button
				class="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
				on:click={connect}
				disabled={connected}
			>
				Connect
			</button>
		</div>
		<p>Status: {connected ? 'Connected' : 'Not connected'}</p>
	</section>

	<section class="space-y-2">
		<h2 class="text-lg font-semibold">Send File</h2>
		<div class="flex items-center gap-2">
			<input type="file" class="flex-1" multiple/>
			<button
				class="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600 disabled:opacity-50"
				on:click={doSendFile}
				disabled={!connected}
			>
				Send
			</button>
		</div>
	</section>

	<section class="space-y-2">
		<h2 class="text-lg font-semibold">Transfers</h2>
		{#if transfers.size === 0}
			<p class="text-gray-500">No active transfers</p>
		{:else}
			<ul class="space-y-1">
				{#each Array.from(transfers.values()) as t}
					<li class="flex items-center justify-between rounded border p-2">
						<span>{t.fileName}</span>
						<span>{Math.round((t.receivedBytes / t.fileSize) * 100)}%</span>
						{#if t.completedFile}
							<button
								class="ml-2 rounded bg-indigo-500 px-3 py-1 text-white hover:bg-indigo-600"
								on:click={() => downloadFile(t.completedFile)}
							>
								Download
							</button>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</main>

<style>
	main {
		font-family: system-ui, sans-serif;
	}
</style>
