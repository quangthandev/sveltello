import { createTag } from './create-tag';

const codeBlock = createTag({
	format: 'code-block',
	pattern: /^(```).*/g,
	tagNames: ['pre'],
	formatter: function ({ quill, match, selection }) {
		const originalText = match[0];

		setTimeout(() => {
			const startIndex = selection.index - originalText.length;
			quill.deleteText(startIndex, originalText.length);
			setTimeout(() => {
				quill.formatLine(startIndex, 1, this.format, true);

				// Insert new line after the code block so that user can exit the code block
				quill.insertText(startIndex + 1, '\n', 'silent');
			}, 0);
		}, 0);
	}
});

export default codeBlock;
