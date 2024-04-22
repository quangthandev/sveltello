// Reference: https://github.com/cloverhearts/quilljs-markdown

import type Quill from 'quill';
import type { Delta } from 'quill/core';
import type { EmitterSource } from 'quill/core/emitter';
import { tags } from './tags';
import type { Tag, TagName } from './create-tag';

export type Options = {
	ignoreTags?: TagName[];
};

class QuillMarkdown {
	private handleTextChangeBound: (delta: Delta, oldContent: Delta, source: EmitterSource) => void;
	private triggerCharacters: string[];
	private tags: Tag[];
	private ignoreTags: TagName[];

	options: Options;

	constructor(
		private quill: Quill,
		options: Options = {}
	) {
		this.quill = quill;
		this.options = options;
		this.triggerCharacters = [
			' ', // headings, blockquote, lists
			'*', // bold, italic
			')', // link
			'`', // code, pre
			'~', // strikethrough
			'_', // bold, italic
			'-' // horizontal rule
		];
		this.ignoreTags = options.ignoreTags ?? [];
		this.tags = tags;

		this.handleTextChangeBound = this.handleTextChange.bind(this);
		this.quill.on('text-change', this.handleTextChangeBound);
	}

	destroy() {
		this.quill.off('text-change', this.handleTextChangeBound);
	}

	isValidTag(tag: Tag) {
		return tag.tagNames.every((tagName) => !this.ignoreTags.includes(tagName));
	}

	handleTextChange(delta: Delta, _oldContent: Delta, source: EmitterSource) {
		if (source !== 'user') return;

		const inputText = delta.ops[0].insert || (delta.ops[1] && delta.ops[1].insert);

		if (!inputText) return;

		delta.ops
			.filter((op) => Object.prototype.hasOwnProperty.call(op, 'insert'))
			.forEach((op) => {
				if (typeof op.insert === 'string' && this.triggerCharacters.includes(op.insert)) {
					// Allow users to undo formatting
					this.quill.history.cutoff();

					const selection = this.quill.getSelection();
					if (!selection) return;
					const [line, offset] = this.quill.getLine(selection.index);
					const text = line?.domNode.textContent || '';
					const lineStart = selection.index - offset;
					const format = this.quill.getFormat(lineStart);
					if (format['code-block'] || format['code']) {
						// if exists text in code-block, to skip.
						return;
					}
					for (const tag of this.tags) {
						if (this.isValidTag(tag)) {
							const match = tag.match(text, lineStart);

							if (match) {
								return tag.formatter({
									quill: this.quill,
									text,
									match,
									selection,
									lineStart
								});
							}
						}
					}
				}
			});
	}
}

export default QuillMarkdown;
