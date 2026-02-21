import words from '$lib/data/words.json';

export function generateCode(numberOfWords = 3, delimeter = '-') {
	const codeWords: string[] = [];
	for (let i = 0; i < numberOfWords; i++) {
		const word = words[Math.floor(Math.random() * words.length)];
		codeWords.push(word);
	}
	return codeWords.join(delimeter);
}
