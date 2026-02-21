export async function hashFile(fileOrBuffer: File | ArrayBuffer): Promise<string> {
	let arrayBuffer: ArrayBuffer;

	if (fileOrBuffer instanceof File) {
		arrayBuffer = await fileOrBuffer.arrayBuffer();
	} else {
		arrayBuffer = fileOrBuffer;
	}

	const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

	return hashHex;
}
