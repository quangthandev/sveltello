import type Quill from 'quill';
import AbstractTag from '../AbstractTag';
import type { Options, Tag, TagImpl, TagPattern } from '../../types';
import meta from '../meta';

class Blockquote extends AbstractTag implements TagImpl {
	private name: string;
	private pattern: TagPattern;
	private _meta: ReturnType<typeof meta>;
	private activeTags: string[];

	constructor(
		private quillJS: Quill,
		options: Options = {}
	) {
		super();

		this.quillJS = quillJS;
		this.name = 'blockquote';
		this.pattern = this._getCustomPatternOrDefault(options, this.name, /^(>)\s/g);
		this.getAction.bind(this);
		this._meta = meta([this.name]);
		this.activeTags = this._getActiveTagsWithoutIgnore(
			this._meta.applyHtmlTags,
			options.ignoreTags ?? []
		);
	}

	getAction(): Tag {
		return {
			name: this.name,
			pattern: this.pattern,
			action: (text, selection, pattern) =>
				new Promise((resolve) => {
					const match = (pattern as RegExp).exec(text);
					if (!match || !this.activeTags.length) {
						return resolve(false);
					}
					const originalText = match[0] || '';
					setTimeout(() => {
						this.quillJS.formatText(
							{ index: selection.index, length: match.input.length - 1 },
							this.name,
							true
						);
						this.quillJS.deleteText(selection.index - originalText.length, originalText.length);
						resolve(true);
					}, 0);
				}),
			release: () => {
				setTimeout(() => {
					const contentIndex = this.quillJS.getSelection()!.index;

					const [, length] = this.quillJS.getLine(contentIndex);
					if (length === 0) this.quillJS.format(this.name, false);
				}, 0);
			}
		};
	}
}

export default Blockquote;
