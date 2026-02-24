<!-- <script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$lib/session.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import * as Registry from './registry/registry.remote';
	import * as FileDropZone from '$lib/components/ui/file-drop-zone';
	import * as Card from '$lib/components/ui/card/index';

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
					type: file.type,
					hash: ''
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
</script> -->

<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as FileDropZone from '$lib/components/ui/file-drop-zone';
	import { XIcon, Upload } from '@lucide/svelte';
	import { onDestroy, onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index';
	import Icon, { isImage } from '$lib/icon.svelte';
	import { Input } from '$lib/components/ui/input/index';
	import { cn } from '$lib/utils';

	const onUpload: FileDropZone.FileDropZoneRootProps['onUpload'] = async (files: File[]) => {
		await Promise.allSettled(files.map((file: File) => uploadFile(file)));
	};

	const uploadFile = async (file: File) => {
		if (files.find((f) => f.name === file.name)) return;
		files.push({
			name: file.name,
			type: file.type,
			size: file.size,
			url: URL.createObjectURL(file)
		});
		console.log(files);
	};

	type UploadedFile = {
		name: string;
		type: string;
		size: number;
		url: string;
	};

	let files = $state<UploadedFile[]>([]);

	onDestroy(() => {
		for (const file of files) {
			URL.revokeObjectURL(file.url);
		}
	});

	onMount(() => {
		files = [
			{
				name: 'APPLICATION_FOR_RESIDENCE_LOG1-1.pdf',
				type: 'application/pdf',
				size: 105938,
				url: 'blob:http://localhost:5173/7f8f3cfa-f8d5-4833-be99-9e5bf530f98e'
			},
			{
				name: 'tudorshoots-05319.jpg',
				type: 'image/jpeg',
				size: 15567609,
				url: '/Copy of tudorshoots-05319.jpg'
			},
			{
				name: 'project_archive_sysdvr.zip',
				type: 'application/zip',
				size: 3188132,
				url: 'blob:http://localhost:5173/bd1f1965-5da8-4b16-9b52-beba20b581f8'
			},
			{
				name: 'sample_video_480p.mp4',
				type: 'video/mp4',
				size: 1570024,
				url: 'blob:http://localhost:5173/b63bd8c0-f2b5-40b1-ba71-6a53a2948912'
			},
			{
				name: '3dkeycap_lame.png',
				type: 'image/png',
				size: 22503,
				url: '3dkeycap lame.png'
			},
			{
				name: 'Choc_Stem_With_Homing_Bar.stl',
				type: 'model/stl',
				size: 1766384,
				url: 'blob:http://localhost:5173/6bd074f1-3c81-4e45-be94-16687e1c76b9'
			},
			{
				name: 'proposal_document.docx',
				type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				size: 234567,
				url: 'blob:http://localhost:5173/doc-1'
			},
			{
				name: 'financials_q1.xlsx',
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				size: 987654,
				url: 'blob:http://localhost:5173/xls-1'
			},
			{
				name: 'funny_animation.gif',
				type: 'image/gif',
				size: 54321,
				url: '3dkeycap lame.png'
			},
			{
				name: 'vector_logo.svg',
				type: 'image/svg+xml',
				size: 4321,
				url: '/Copy of tudorshoots-05319.jpg'
			},
			{
				name: 'notes.txt',
				type: 'text/plain',
				size: 1024,
				url: 'blob:http://localhost:5173/text-1'
			},
			{
				name: 'contacts.csv',
				type: 'text/csv',
				size: 2048,
				url: 'blob:http://localhost:5173/csv-1'
			},
			{
				name: 'podcast_episode.mp3',
				type: 'audio/mpeg',
				size: 5120000,
				url: 'blob:http://localhost:5173/mp3-1'
			},
			{
				name: 'sound_effect.wav',
				type: 'audio/wav',
				size: 256000,
				url: 'blob:http://localhost:5173/wav-1'
			},
			{
				name: 'old_movie.avi',
				type: 'video/x-msvideo',
				size: 452000000,
				url: 'blob:http://localhost:5173/avi-1'
			},
			{
				name: 'clip.webm',
				type: 'video/webm',
				size: 1250000,
				url: 'blob:http://localhost:5173/webm-1'
			},
			{
				name: 'sources.tar.gz',
				type: 'application/gzip',
				size: 7800000,
				url: 'blob:http://localhost:5173/tar-1'
			},
			{
				name: 'backup.7z',
				type: 'application/x-7z-compressed',
				size: 25000000,
				url: 'blob:http://localhost:5173/7z-1'
			},
			{
				name: 'presentation_final.pptx',
				type: 'application/vnd.ms-powerpoint',
				size: 1450000,
				url: 'blob:http://localhost:5173/ppt-1'
			},
			{
				name: 'binary_blob.bin',
				type: 'application/octet-stream',
				size: 65536,
				url: 'blob:http://localhost:5173/bin-1'
			}
		];
	});
</script>

<main class="flex min-h-screen items-center justify-center">
	<Card.Root class="m-8 -my-4 w-full max-w-3xl">
		<Card.Header class="flex flex-row items-center justify-between">
			<Card.Title>Share files</Card.Title>
		</Card.Header>
		<Card.Content>
			<FileDropZone.Root {onUpload} fileCount={files.length}>
				<div class="flex w-full flex-col gap-2">
					{#if files.length === 0}
						<FileDropZone.Trigger />
						or
						<Input />
					{:else}
						<div class="flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
							{#each files as file, i (file.name)}
								<div class="flex w-full min-w-0 items-center gap-2 rounded-xl p-1">
									<a
										href={file.url}
										target="_blank"
										title={file.name}
										rel="noopener"
										class="flex size-10 shrink-0 items-center justify-center overflow-clip rounded-lg bg-muted hover:brightness-90"
									>
										{#if isImage(file.type)}
											<img src={file.url} alt={file.name} class="size-full object-cover" />
										{:else}
											<Icon mimeType={file.type} size={24} />
										{/if}
									</a>
									<div class="flex min-w-0 flex-1 flex-col">
										<a
											href={file.url}
											target="_blank"
											rel="noopener"
											title={file.name}
											class="max-w-full self-start truncate text-sm hover:underline"
										>
											{file.name}
										</a>
										<span class="text-xs text-muted-foreground"
											>{FileDropZone.displaySize(file.size)}</span
										>
									</div>
									<Button
										size="icon"
										variant="ghost"
										class="size-7 shrink-0"
										onclick={() => {
											URL.revokeObjectURL(file.url);
											files = [...files.slice(0, i), ...files.slice(i + 1)];
										}}
									>
										<XIcon class="size-3.5" />
									</Button>
								</div>
							{/each}
						</div>
						<div class="flex flex-row justify-between">
							<FileDropZone.Trigger
								role="button"
								class={cn(
									buttonVariants({ variant: 'link' }),
									'cursor-pointer p-1 text-sm text-muted-foreground'
								)}
							>
								{#snippet children()}
									Add more files
								{/snippet}
							</FileDropZone.Trigger>
							<Button
								variant="link"
								class="cursor-pointer p-1 text-sm text-muted-foreground"
								onclick={() => {
									for (const file of files) URL.revokeObjectURL(file.url);
									files = [];
								}}
							>
								Remove all
							</Button>
						</div>
					{/if}
				</div>
			</FileDropZone.Root>
			{#if files.length !== 0}
				<div class="flex justify-center pt-2">
					<Button size="lg" class="cursor-pointer">
						<Upload />
						Share</Button
					>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</main>
