<script lang="ts">
	import { page } from '$app/state';
	import { peer, session } from '$lib/session.svelte';
	import { handleIncoming } from '$lib/peer';
	import { sendRequest } from '$lib/protocol';
	import * as Registry from '../../registry/registry.remote';
	import { onMount } from 'svelte';

	let remoteCode = page.params.code;

	async function connect() {
		if (!remoteCode) return;
		const remoteId = await Registry.lookup(remoteCode);
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
	}

	function requestFile(fileId: string) {
		if (!session.conn) return;
		sendRequest(session.conn, fileId);
	}

	onMount(() => {
		if (remoteCode) connect();
	});
</script>

<main class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-md">
		<h1 class="text-center text-2xl font-bold text-gray-800">Receiving</h1>

		<div class="flex items-center justify-center gap-2">
			<div
				class="h-3 w-3 rounded-full {session.connected ? 'bg-green-400' : 'bg-yellow-400'}"
			></div>
			<span class="text-sm text-gray-600"
				>{session.connected ? 'Connected to sender' : 'Connecting...'}</span
			>
		</div>

		{#if session.receiverFiles.size > 0}
			<ul class="space-y-2">
				{#each Array.from(session.receiverFiles.entries()) as [id, file]}
					<li class="space-y-2 rounded-xl border border-gray-200 p-3">
						<div class="flex justify-between text-sm text-gray-700">
							<span class="truncate">{file.name}</span>
							<span>{Math.round((file.receivedBytes / file.size) * 100)}%</span>
						</div>
						<div class="h-2 w-full rounded-full bg-gray-100">
							<div
								class="h-2 rounded-full bg-blue-500 transition-all"
								style="width: {Math.round((file.receivedBytes / file.size) * 100)}%"
							></div>
						</div>
						<button
							onclick={() => requestFile(id)}
							class="w-full rounded-lg bg-indigo-500 py-2 text-sm text-white transition hover:bg-indigo-600"
						>
							Download
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-center text-sm text-gray-400">Waiting for files...</p>
		{/if}

		<a href="/" class="block text-center text-sm text-gray-400 hover:text-gray-600">← Back</a>
	</div>
</main>
