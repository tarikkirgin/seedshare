import type { SvelteMap } from 'svelte/reactivity';

export type FileId = string;
export interface FileMetadata {
	name: string;
	size: number;
	type: string;
	hash: string;
}

export interface SenderFile extends FileMetadata {
	file: File;
}

export interface ReceiverFile extends FileMetadata {
	receivedBytes: number;
	chunks: ArrayBuffer[];
	file?: File;
}

export type FileMetadataMap = SvelteMap<FileId, FileMetadata>;
export type SenderFileMap = SvelteMap<FileId, SenderFile>;
export type ReceiverFileMap = SvelteMap<FileId, ReceiverFile>;
