<script lang="ts">
  import { goto } from '$app/navigation';
  import { peerState } from '$lib/store.svelte';
  import * as Registry from './registry/registry.remote';

  let remoteCode = $state('');
  let fileInput: HTMLInputElement;

  async function onFilesPicked() {
    if (!fileInput.files || fileInput.files.length === 0) return;
    peerState.pendingFiles = fileInput.files;
    peerState.code = await Registry.register(peerState.peerId);
    goto('/send');
  }

  async function join() {
    if (!remoteCode.trim()) return;
    goto(`/receive/${remoteCode.trim()}`);
  }
</script>

<input bind:this={fileInput} type="file" multiple class="hidden" onchange={onFilesPicked} />

<main class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm space-y-6">
    <h1 class="text-2xl font-bold text-center text-gray-800">File Share</h1>

    <button
      onclick={() => fileInput.click()}
      class="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl transition"
    >
      Send a file
    </button>

    <div class="flex items-center gap-2">
      <hr class="flex-1 border-gray-200" />
      <span class="text-sm text-gray-400">or receive</span>
      <hr class="flex-1 border-gray-200" />
    </div>

    <div class="space-y-3">
      <input
        bind:value={remoteCode}
        placeholder="Enter code"
        class="w-full border border-gray-300 rounded-xl px-4 py-3 text-center font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400"
        onkeydown={(e) => e.key === 'Enter' && join()}
      />
      <button
        onclick={join}
        disabled={!remoteCode.trim()}
        class="w-full bg-green-500 hover:bg-green-600 disabled:opacity-40 text-white font-medium py-3 rounded-xl transition"
      >
        Receive
      </button>
    </div>
  </div>
</main>
