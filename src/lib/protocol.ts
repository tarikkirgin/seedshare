import { type DataConnection } from 'peerjs';

const CHUNKED = true;

export interface Transfer {
	fileName: string;
	fileSize: number;
	chunks: ArrayBuffer[];
	receivedBytes: number;
	checksum: string;
	completedFile?: File;
}

export enum MessageType {
	Metadata = 'metadata',
	Progress = 'progress',
	Complete = 'complete',
	Cancel = 'cancel',
	Ping = 'ping',
	Pong = 'pong',
	Error = 'error',
	Data = 'data',
	Request = 'request'
}

export interface MessageBase {
	type: MessageType;
	transferId: string;
	data: unknown;
}

export interface MessageMetadata extends MessageBase {
	type: MessageType.Metadata;
	data: {
		fileName: string;
		fileSize: number;
		fileType: string;
		checksum: string;
	};
}

export function sendMetadata(
	conn: DataConnection,
	transferId: string,
	data: MessageMetadata['data']
) {
	sendMessage(conn, { type: MessageType.Metadata, transferId, data });
}

export interface MessageProgress extends MessageBase {
	type: MessageType.Progress;
	data: {
		bytesReceived: number;
		bytesTotal: number;
	};
}

export function sendProgress(
	conn: DataConnection,
	transferId: string,
	data: MessageProgress['data']
) {
	sendMessage(conn, { type: MessageType.Progress, transferId, data });
}

export interface MessageComplete extends MessageBase {
	type: MessageType.Complete;
	data: {
		checksum: string;
	};
}

export function sendComplete(
	conn: DataConnection,
	transferId: string,
	data: MessageComplete['data']
) {
	sendMessage(conn, { type: MessageType.Complete, transferId, data });
}

export interface MessageCancel extends MessageBase {
	type: MessageType.Cancel;
	data: {
		reason: string;
	};
}

export function sendCancel(conn: DataConnection, transferId: string, data: MessageCancel['data']) {
	sendMessage(conn, { type: MessageType.Cancel, transferId, data });
}

export interface MessagePing extends MessageBase {
	type: MessageType.Ping;
	data: {
		timestamp: number;
	};
}

export function sendPing(conn: DataConnection, transferId: string, data: MessagePing['data']) {
	sendMessage(conn, { type: MessageType.Ping, transferId, data });
}

export interface MessagePong extends MessageBase {
	type: MessageType.Pong;
	data: {
		timestamp: number;
	};
}

export function sendPong(conn: DataConnection, transferId: string, data: MessagePong['data']) {
	sendMessage(conn, { type: MessageType.Pong, transferId, data });
}

export interface MessageError extends MessageBase {
	type: MessageType.Error;
	data: {
		code: string;
		message: string;
	};
}

export function sendError(conn: DataConnection, transferId: string, data: MessageError['data']) {
	sendMessage(conn, { type: MessageType.Error, transferId, data });
}

export interface MessageData extends MessageBase {
	type: MessageType.Data;
	data: {
		chunk: ArrayBuffer;
	};
}

export function sendData(conn: DataConnection, transferId: string, data: MessageData['data']) {
	sendMessage(conn, {
		type: MessageType.Data,
		transferId,
		data
	});
}

export interface MessageRequest extends MessageBase {
	type: MessageType.Request;
}

export function sendRequest(conn: DataConnection, transferId: string) {
	sendMessage(conn, { type: MessageType.Request, transferId, data: null });
}

export type Message =
	| MessageMetadata
	| MessageProgress
	| MessageComplete
	| MessageCancel
	| MessagePing
	| MessagePong
	| MessageError
	| MessageData
	| MessageRequest;

function sendMessage(conn: DataConnection, msg: Message) {
	conn.send(msg, CHUNKED);
}

export function isMessage(msg: unknown): msg is Message {
	if (typeof msg !== 'object' || msg === null) return false;
	const type = (msg as { type?: unknown }).type;
	return typeof type === 'string' && Object.values(MessageType).includes(type as MessageType);
}
