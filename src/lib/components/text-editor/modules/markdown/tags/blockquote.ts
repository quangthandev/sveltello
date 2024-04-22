import { createTag } from '../create-tag';

const blockquote = createTag({
	format: 'blockquote',
	pattern: /^(>)\s(?!\s)/g,
	tagNames: ['blockquote'],
	formatter: function ({ quill, match, selection }) {
		const originalText = match[0];

		setTimeout(() => {
			quill.formatText(
				{ index: selection.index, length: match.input.length - 1 },
				this.format,
				true
			);
			quill.deleteText(selection.index - originalText.length, originalText.length);
		}, 0);
	}
});

export default blockquote;
