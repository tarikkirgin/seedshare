import { type DataConnection } from 'peerjs';
import type { FileMetadata } from './types';

const CHUNKED = true;

export enum MessageType {
	Metadata = 'metadata',
	Progress = 'progress',
	Complete = 'complete',
	Cancel = 'cancel',
	Ping = 'ping',
	Pong = 'pong',
	Error = 'error',
	Chunk = 'chunk',
	Request = 'request'
}

export interface MetadataMessage {
	type: MessageType.Metadata;
	files: FileMetadata[];
}

export interface PingMessage {
	type: MessageType.Ping;
	timestamp: number;
}

export interface PongMessage {
	type: MessageType.Pong;
	timestamp: number;
}

export interface ProgressMessage {
	type: MessageType.Progress;
	fileId: string;
	bytesReceived: number;
	bytesTotal: number;
}

export interface CompleteMessage {
	type: MessageType.Complete;
	fileId: string;
	checksum: string;
}

export interface CancelMessage {
	type: MessageType.Cancel;
	fileId: string;
	reason: string;
}

export interface ErrorMessage {
	type: MessageType.Error;
	fileId: string;
	code: string;
	message: string;
}

export interface ChunkMessage {
	type: MessageType.Chunk;
	fileId: string;
	chunk: ArrayBuffer;
}

export interface RequestMessage {
	type: MessageType.Request;
	fileId: string;
}

export type Message =
	| MetadataMessage
	| PingMessage
	| PongMessage
	| ProgressMessage
	| CompleteMessage
	| CancelMessage
	| ErrorMessage
	| ChunkMessage
	| RequestMessage;

function send(conn: DataConnection, msg: Message) {
	conn.send(msg, CHUNKED);
}

export const sendMetadata = (conn: DataConnection, files: FileMetadata[]) =>
	send(conn, { type: MessageType.Metadata, files });

export const sendPing = (conn: DataConnection) =>
	send(conn, { type: MessageType.Ping, timestamp: Date.now() });

export const sendPong = (conn: DataConnection, timestamp: number) =>
	send(conn, { type: MessageType.Pong, timestamp });

export const sendProgress = (
	conn: DataConnection,
	fileId: string,
	bytesReceived: number,
	bytesTotal: number
) => send(conn, { type: MessageType.Progress, fileId, bytesReceived, bytesTotal });

export const sendComplete = (conn: DataConnection, fileId: string, checksum: string) =>
	send(conn, { type: MessageType.Complete, fileId, checksum });

export const sendCancel = (conn: DataConnection, fileId: string, reason: string) =>
	send(conn, { type: MessageType.Cancel, fileId, reason });

export const sendError = (conn: DataConnection, fileId: string, code: string, message: string) =>
	send(conn, { type: MessageType.Error, fileId, code, message });

export const sendChunk = (conn: DataConnection, fileId: string, chunk: ArrayBuffer) =>
	send(conn, { type: MessageType.Chunk, fileId, chunk });

export const sendRequest = (conn: DataConnection, fileId: string) =>
	send(conn, { type: MessageType.Request, fileId });

export function isMessage(msg: unknown): msg is Message {
	if (typeof msg !== 'object' || msg === null) return false;
	const type = (msg as { type?: unknown }).type;
	return typeof type === 'string' && Object.values(MessageType).includes(type as MessageType);
}
