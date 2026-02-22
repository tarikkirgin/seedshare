<script lang="ts">
	import { peerState, transfers } from '$lib/store.svelte';
	import { sendFile } from '$lib/peer';
	import QRCode from '@castlenine/svelte-qrcode';

	let fileInput: HTMLInputElement | null = null;

	let copied = false;
	function handleCopy() {
		navigator.clipboard.writeText(peerState.code);
		copied = true;
		setTimeout(() => (copied = false), 1200);
	}

	function handleAddFiles(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			if (!peerState.pendingFiles) peerState.pendingFiles = [];
			peerState.pendingFiles = [...peerState.pendingFiles, ...Array.from(target.files)];
		}
	}

	async function doSendFile() {
		if (!peerState.conn || !peerState.pendingFiles) return;
		for (let i = 0; i < peerState.pendingFiles.length; i++) {
			await sendFile(peerState.conn, peerState.pendingFiles[i]);
		}
	}

	doSendFile();
</script>

<main class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-md">
		<h1 class="text-center text-2xl font-bold text-gray-800">Sending</h1>
		<div class="align-items-center width-full height-full flex justify-center">
			<QRCode data="http://localhost:5173/receive/{peerState.code}" />
		</div>
		<div class="mt-2 flex items-center gap-2">
			<input
				type="text"
				value={peerState.code}
				class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				readonly
			/>

			<button
				type="button"
				class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-1 text-sm text-gray-600 transition-colors hover:bg-gray-100"
				on:click={handleCopy}
				aria-label={copied ? 'Copied' : 'Copy code'}
			>
				{#if !copied}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13.828 10.172a4 4 0 0 1 0 5.656l-3.536 3.536a4 4 0 0 1-5.656-5.656l3.536-3.536"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10.172 13.828a4 4 0 0 1 0-5.656l3.536-3.536a4 4 0 0 1 5.656 5.656l-3.536 3.536"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4 text-green-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
				{/if}
			</button>
		</div>

		{#if peerState.pendingFiles}
			<ul class="space-y-1">
				{#each peerState.pendingFiles as file}
					<li class="truncate rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600">
						{file.name}
					</li>
				{/each}
			</ul>
			<div class="mt-2 flex justify-end">
				<input
					type="file"
					multiple
					class="hidden"
					bind:this={fileInput}
					on:change={handleAddFiles}
				/>
				<button
					type="button"
					class="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
					on:click={() => fileInput && fileInput.click()}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4v16m8-8H4"
						/></svg
					>
					Add more files
				</button>
			</div>
		{/if}

		{#if transfers.size > 0}
			<ul class="space-y-2">
				{#each Array.from(transfers.values()) as t}
					<li class="space-y-2 rounded-xl border border-gray-200 p-3">
						<div class="flex justify-between text-sm text-gray-700">
							<span class="truncate">{t.fileName}</span>
							<span>{Math.round((t.receivedBytes / t.fileSize) * 100)}%</span>
						</div>
						<div class="h-2 w-full rounded-full bg-gray-100">
							<div
								class="h-2 rounded-full bg-blue-500 transition-all"
								style="width: {Math.round((t.receivedBytes / t.fileSize) * 100)}%"
							></div>
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		<a href="/" class="block text-center text-sm text-gray-400 hover:text-gray-600">← Back</a>
	</div>
</main>
