import type { SvelteMap } from 'svelte/reactivity';

export type FileId = string;

export interface SenderFile {
	file: File;
	name: string;
	size: number;
	checksum: string;
}

export interface ReceiverFile {
	name: string;
	size: number;
	checksum: string;
	receivedBytes: number;
	chunks: ArrayBuffer[];
	file?: File;
}

export interface FileMetadata {
	id: FileId;
	name: string;
	size: number;
	type: string;
	checksum: string;
}

export type SenderFileMap = SvelteMap<FileId, SenderFile>;
export type ReceiverFileMap = SvelteMap<FileId, ReceiverFile>;
