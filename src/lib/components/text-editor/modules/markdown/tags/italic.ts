import { createTag } from './create-tag';

const italic = createTag({
	format: 'italic',
	pattern:
		/(?:^|\s)(?:(\*|_)\s*(?<text1>[^*_]+)\s*?(\1)|(\*|_){3}\s*(?<text3>[^*_]*)\s*\4{3})(?:$|(?=\s))(?!\s)/g,
	tagNames: ['italic'],
	formatter: function ({ quill, match, lineStart }) {
		const annotatedText = match[0];
		let matchedText = '';

		if (match.groups?.text1) {
			matchedText = match[2];
		} else {
			matchedText = match[4];
		}

		const startIndex = lineStart + match.index;

		setTimeout(() => {
			const isFirstLine = !match.index;
			const adjustPosition = isFirstLine ? startIndex : startIndex + 1;
			const deleteEndOffset = isFirstLine ? annotatedText.length : annotatedText.length - 1;

			quill.format(this.format, false, 'user');
			quill.deleteText(adjustPosition, deleteEndOffset);
			quill.insertText(
				adjustPosition,
				matchedText,
				{
					[this.format]: true
				},
				'user'
			);

			// Move cursor to the end of the inserted text
			quill.setSelection(adjustPosition + matchedText.length, 0);
		}, 0);
	},
	customMatcher: (text, pattern) => {
		const match = pattern.exec(text);

		if (!match) {
			return null;
		}

		const matchedToken = match[1] || match[3];
		const firstToken = text[match.index];
		const secondToken = text[match.index + 1];

		if (matchedToken === firstToken && firstToken === secondToken) {
			return null;
		}

		return match;
	}
});

export default italic;
