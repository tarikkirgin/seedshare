<script lang="ts">
	import { session } from '$lib/store.svelte';
</script>

<main class="flex min-h-screen items-center justify-center bg-gray-100">
	<div class="w-full max-w-sm space-y-6 rounded-2xl bg-white p-8 shadow-md">
		<h1 class="text-center text-2xl font-bold text-gray-800">Sending</h1>

		<div class="space-y-1 text-center">
			<p class="text-sm text-gray-500">Share this code with the receiver</p>
			<p class="font-mono text-3xl font-bold tracking-widest text-gray-800">{session.code}</p>
		</div>

		<div class="flex items-center justify-center gap-2">
			<div
				class="h-3 w-3 rounded-full {session.connected ? 'bg-green-400' : 'bg-yellow-400'}"
			></div>
			<span class="text-sm text-gray-600"
				>{session.connected ? 'Receiver connected' : 'Waiting for receiver...'}</span
			>
		</div>

		{#if session.pendingFiles.size > 0}
			<ul class="space-y-2">
				{#each Array.from(session.pendingFiles.entries()) as [id, f]}
					<li class="space-y-2 rounded-xl border border-gray-200 p-3">
						<div class="flex justify-between text-sm text-gray-700">
							<span class="truncate">{f.name}</span>
						</div>
					</li>
				{/each}
			</ul>
		{/if}

		<a href="/" class="block text-center text-sm text-gray-400 hover:text-gray-600">← Back</a>
	</div>
</main>
