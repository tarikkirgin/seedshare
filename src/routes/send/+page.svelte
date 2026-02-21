<script lang="ts">
  import { peerState, transfers } from '$lib/store.svelte';
  import { sendFile } from '$lib/peer';

  async function doSendFile() {
    if (!peerState.conn || !peerState.pendingFiles) return;
    for (let i = 0; i < peerState.pendingFiles.length; i++) {
      await sendFile(peerState.conn, peerState.pendingFiles[i]);
    }
  }
</script>

<main class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm space-y-6">
    <h1 class="text-2xl font-bold text-center text-gray-800">Sending</h1>

    <div class="text-center space-y-1">
      <p class="text-sm text-gray-500">Share this code with the receiver</p>
      <p class="font-mono text-3xl font-bold tracking-widest text-gray-800">{peerState.code}</p>
    </div>

    <div class="flex items-center gap-2 justify-center">
      <div class="w-3 h-3 rounded-full {peerState.connected ? 'bg-green-400' : 'bg-yellow-400'}"></div>
      <span class="text-sm text-gray-600">{peerState.connected ? 'Receiver connected' : 'Waiting for receiver...'}</span>
    </div>

    {#if peerState.pendingFiles}
      <ul class="space-y-1">
        {#each Array.from(peerState.pendingFiles) as file}
          <li class="text-sm text-gray-600 border border-gray-200 rounded-lg px-3 py-2 truncate">{file.name}</li>
        {/each}
      </ul>
    {/if}

    <button
      onclick={doSendFile}
      disabled={!peerState.connected}
      class="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-medium py-3 rounded-xl transition"
    >
      Send
    </button>

    {#if transfers.size > 0}
      <ul class="space-y-2">
        {#each Array.from(transfers.values()) as t}
          <li class="border border-gray-200 rounded-xl p-3 space-y-2">
            <div class="flex justify-between text-sm text-gray-700">
              <span class="truncate">{t.fileName}</span>
              <span>{Math.round((t.receivedBytes / t.fileSize) * 100)}%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full transition-all"
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
