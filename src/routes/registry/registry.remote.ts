import * as v from 'valibot';
import { query } from '$app/server';
import { registry } from '$lib/server/registry';
import { generateCode } from '$lib/code.js';

export const register = query(v.string(), async (peerId) => {
	if (!peerId) {
		throw new Error('missing peerId');
	}

	let code: string;
	do {
		code = generateCode();
	} while (registry.has(code));

	registry.set(code, peerId);

	return code;
});

export const lookup = query(v.string(), async (code) => {
	if (!code) {
		throw new Error('missing code');
	}

	const peerId = registry.get(code);
	if (!peerId) {
		throw new Error('not found');
	}

	return peerId;
});
