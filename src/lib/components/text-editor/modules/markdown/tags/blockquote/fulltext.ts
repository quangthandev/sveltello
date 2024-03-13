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
		this.pattern = this._getCustomPatternOrDefault(options, this.name, /^\s{0,99}(>)\s/g);
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
						resolve(false);
						return;
					}
					const originalText = match[0] || '';
					setTimeout(() => {
						const startOffset = selection.index - 1;
						this.quillJS.deleteText(startOffset, 2);
						setTimeout(() => {
							this.quillJS.formatLine(startOffset, originalText.length - 3, 'blockquote', true);
							resolve(true);
						}, 0);
					}, 0);
				})
		};
	}
}

export default Blockquote;
