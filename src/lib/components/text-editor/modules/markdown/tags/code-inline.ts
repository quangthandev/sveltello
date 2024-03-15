import { createTag } from './factory';

const inlineCode = createTag({
	format: 'code',
	pattern: /(`){1}(.+)(`){1}/g,
	tagNames: ['code'],
	formatter:
		(format) =>
		({ quill, match, lineStart }) => {
			const [annotatedText] = match;
			const startIndex = lineStart + match.index;
			setTimeout(() => {
				quill.format('code', false);
				quill.deleteText(startIndex, annotatedText.length);

				setTimeout(() => {
					const message = annotatedText.replace(/`/g, '');
					quill.insertText(startIndex, message, { [format]: true }, 'user');

					// Move cursor to the end of the inserted text
					quill.setSelection(startIndex + message.length, 'silent');
				}, 0);
			}, 0);
		}
});

export default inlineCode;
