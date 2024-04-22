import { createTag } from './create-tag';

const headings = createTag({
	format: 'header',
	pattern: /^(#){1,6}\s/g,
	tagNames: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
	formatter: function ({ quill, match, selection }) {
		const size = match[0].length;
		const [line] = quill.getLine(selection.index);

		if (!line) return;

		const index = quill.getIndex(line);

		setTimeout(() => {
			quill.formatLine(index, 0, this.format, size - 1);
			quill.deleteText(index, size);
		}, 0);
	}
});

export default headings;
