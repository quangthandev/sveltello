import { createTag } from './factory';

const link = createTag({
	format: 'link',
	pattern: /(?:\[(.+?)\])(?:\((.+?)\))/g,
	tagNames: ['link'],
	formatter:
		(format, pattern) =>
		({ quill, text, match, lineStart }) => {
			const startIndex = lineStart + match.index;
			const matchedText = text.match(pattern)?.[0];
			const linkStartIndex = text.search(pattern);
			const hrefText = text.match(/(?:\[(.*?)\])/g)?.[0];
			const hrefLink = text.match(/(?:\((.*?)\))/g)?.[0];

			if (!matchedText || !hrefText || !hrefLink || linkStartIndex === -1) return;

			setTimeout(() => {
				const removeOffset = startIndex;

				quill.format(format, false);
				quill.deleteText(removeOffset, matchedText.length);
				quill.insertText(
					removeOffset,
					hrefText.slice(1, hrefText.length - 1),
					format,
					hrefLink.slice(1, hrefLink.length - 1),
					'user'
				);

				// Move cursor to the end of the inserted text
				quill.setSelection(removeOffset + hrefText.length - 2, 'silent');
			}, 0);
		}
});

export default link;
