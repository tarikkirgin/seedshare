<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$lib/session.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import * as Registry from './registry/registry.remote';
	import { Button } from 'bits-ui';

	let remoteCode = $state('');
	let fileInput: HTMLInputElement;

	async function onFilesPicked() {
		if (!fileInput.files || fileInput.files.length === 0) return;
		session.senderFiles = new SvelteMap(
			Array.from(fileInput.files).map((file) => [
				crypto.randomUUID(),
				{
					file,
					name: file.name,
					size: file.size,
					checksum: ''
				}
			])
		);
		session.code = await Registry.register(session.peerId);
		goto('/send');
	}

	async function join() {
		if (!remoteCode.trim()) return;
		goto(`/receive/${remoteCode.trim()}`);
	}
</script>

<input bind:this={fileInput} type="file" multiple class="hidden" onchange={onFilesPicked} />

<main class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-md">
		<h1 class="text-center text-2xl font-bold text-gray-800">File Share</h1>

		<Button.Root
			onclick={() => fileInput.click()}
			class="block w-full rounded-xl bg-blue-500 py-3 text-center font-medium text-white transition hover:bg-blue-600"
		>
			Send a file
		</Button.Root>

		<div class="flex items-center gap-2">
			<hr class="flex-1 border-gray-200" />
			<span class="text-sm text-gray-400">or receive</span>
			<hr class="flex-1 border-gray-200" />
		</div>

		<div class="space-y-3">
			<input
				bind:value={remoteCode}
				placeholder="Enter code"
				class="w-full rounded-xl border border-gray-300 px-4 py-3 text-center font-mono tracking-widest focus:ring-2 focus:ring-blue-400 focus:outline-none"
				onkeydown={(e) => e.key === 'Enter' && join()}
			/>
			<Button.Root
				onclick={join}
				disabled={!remoteCode.trim()}
				class="w-full rounded-xl bg-green-500 py-3 font-medium text-white transition hover:bg-green-600 disabled:opacity-40"
			>
				Receive
			</Button.Root>
		</div>
	</div>
</main>
