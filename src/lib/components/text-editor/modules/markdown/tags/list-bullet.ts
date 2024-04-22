import { createTag } from './create-tag';

const bulletList = createTag({
	format: 'bullet',
	pattern: /^\s{0,9}(-|\*){1}\s/,
	tagNames: ['ul'],
	formatter: function ({ quill, text, selection }) {
		const [line] = quill.getLine(selection.index);

		if (!line) return;

		const index = quill.getIndex(line);

		setTimeout(() => {
			const offsetText = /^\s{0,9}(\*){1}\s/.test(text) ? text.replace('*', '-') : text;
			const depth = offsetText
				.split('- ')[0]
				.split('')
				.filter((e) => /\s/gi.test(e)).length;
			const replaceText =
				offsetText.split('- ').length > 1
					? offsetText.split('- ').splice(1, 1).join('')
					: offsetText;
			quill.insertText(index, replaceText, 'silent');
			quill.deleteText(index + replaceText.length - 1, text.length);
			setTimeout(() => {
				quill.formatLine(index, 0, { list: this.format, indent: depth });
			}, 0);
		}, 0);
	}
});

export default bulletList;
