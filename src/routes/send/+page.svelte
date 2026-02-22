<script lang="ts">
	import { session } from '$lib/session.svelte';
	import QRCode from '@castlenine/svelte-qrcode';
	import FileIcon from '$lib/FileIcon.svelte';

	let fileInput: HTMLInputElement | null = null;

	let copied = false;
	function handleCopy() {
		navigator.clipboard.writeText(`http://localhost:5173/receive/${session.code}`); // TODO: change to dynamic URL
		copied = true;
		setTimeout(() => (copied = false), 1200);
	}

	async function handleAddFiles(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target.files || target.files.length === 0) return;

		for (const file of Array.from(target.files)) {
			session.senderFiles.set(crypto.randomUUID(), {
				file,
				name: file.name,
				size: file.size,
				checksum: ''
			});
		}

		target.value = '';
	}
</script>

<main class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-md">
		<h1 class="text-center text-2xl font-bold text-gray-800">Sending</h1>
		<div class="align-items-center width-full height-full flex justify-center">
			<QRCode data="http://localhost:5173/receive/{session.code}" />
		</div>
		<div class="mt-2 flex items-center gap-2">
			<input
				type="text"
				value={session.code}
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

		{#if session.senderFiles.size > 0}
			<ul class="space-y-1">
				{#each Array.from(session.senderFiles.entries()) as [id, file]}
					<li
						class="flex items-center truncate rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
					>
						<div class="mr-2 flex h-4 w-4 items-center justify-center">
							<FileIcon fileName={file.name} />
						</div>
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

		<a href="/" class="block text-center text-sm text-gray-400 hover:text-gray-600">← Back</a>
	</div>
</main>
