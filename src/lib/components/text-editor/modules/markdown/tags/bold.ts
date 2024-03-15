import { createTag } from './factory';

const bold = createTag({
	format: 'bold',
	pattern: /(\*|_){2}(.+?)(?:\1){2}/g,
	tagNames: ['bold'],
	formatter:
		(format) =>
		({ quill, match, lineStart }) => {
			const [annotatedText, , matchedText] = match;
			const startIndex = lineStart + match.index;

			setTimeout(() => {
				quill.deleteText(startIndex, annotatedText.length);
				setTimeout(() => {
					quill.insertText(startIndex, matchedText, { [format]: true }, 'silent');
					quill.format(format, false);
				});
			}, 0);
		},
	customMatcher: (text, pattern) => {
		const match = pattern.exec(text);

		if (!match || text.match(/^([*_ \n]+)$/g)) {
			return null;
		}

		return match;
	}
});

export default bold;
