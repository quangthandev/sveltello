import { createTag } from './factory';

const strikethrough = createTag({
	format: 'strike',
	pattern: /(?:~|_){2}(.+?)(?:~|_){2}/g,
	tagNames: ['strikethrough'],
	formatter:
		(format) =>
		({ quill, match, lineStart }) => {
			const annotatedText = match[0];
			const matchedText = match[1];
			const startIndex = lineStart + match.index;

			setTimeout(() => {
				quill.format(format, false);
				quill.deleteText(startIndex, annotatedText.length);
				quill.insertText(startIndex, matchedText, { [format]: true }, 'user');

				// Move the cursor to the end of the inserted text
				quill.setSelection(startIndex + matchedText.length, 'silent');
			}, 0);
		},
	customMatcher: (text, pattern) => {
		const match = pattern.exec(text);

		if (!match || text.match(/^([~_ \n]+)$/g)) {
			return null;
		}

		return match;
	}
});

export default strikethrough;
