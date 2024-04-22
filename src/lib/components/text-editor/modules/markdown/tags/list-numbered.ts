import { createTag } from '../create-tag';

const numberedList = createTag({
	format: 'ordered',
	pattern: /^\s{0,9}(\d)+\.\s/g,
	tagNames: ['ol'],
	formatter: function ({ quill, text, selection }) {
		const [line] = quill.getLine(selection.index);

		if (!line) return;

		const index = quill.getIndex(line);

		setTimeout(() => {
			const depth = text
				.split('. ')[0]
				.split('')
				.filter((e) => /\s/gi.test(e)).length;
			const replaceText = text.split('. ').splice(1, 1).join('');
			quill.insertText(index, replaceText, 'user');
			quill.deleteText(index + replaceText.length - 1, text.length);

			setTimeout(() => {
				quill.formatLine(index, 0, { list: this.format, indent: depth });
			}, 0);
		}, 0);
	}
});

export default numberedList;
