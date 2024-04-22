import { createTag } from './create-tag';

const horizontalRule = createTag({
	format: 'hr',
	pattern: /^([-*]\s?){3}/g,
	tagNames: ['hr'],
	formatter: function ({ quill, text, selection }) {
		const startIndex = selection.index - text.length;

		setTimeout(() => {
			quill.deleteText(startIndex, text.length);

			quill.insertEmbed(startIndex + 1, this.format, true, 'user');
			quill.insertText(startIndex + 2, '\n', 'silent');
			quill.setSelection(startIndex + 2, 'silent');
		}, 0);
	}
});

export default horizontalRule;
