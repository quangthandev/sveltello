import type Quill from 'quill';
import AbstractTag from '../AbstractTag';
import meta from '../meta';
import type { Options, Tag, TagImpl, TagPattern } from '../../types';

class Bold extends AbstractTag implements TagImpl {
	quillJS: Quill;
	name: string;
	pattern: TagPattern;
	_meta: ReturnType<typeof meta>;
	activeTags: string[];

	constructor(quillJS: Quill, options: Options = {}) {
		super();
		this.quillJS = quillJS;
		this.name = 'bold';
		this.pattern = this._getCustomPatternOrDefault(options, this.name, /(\*|_){2}(.+?)(?:\1){2}/g);
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
			action: (text, _, pattern, lineStart) =>
				new Promise((resolve) => {
					const match = (pattern as RegExp).exec(text);
					const [annotatedText, , matchedText] = match!;
					const startIndex = lineStart + match!.index;
					if (text.match(/^([*_ \n]+)$/g) || !this.activeTags.length) {
						resolve(false);
						return;
					}

					setTimeout(() => {
						this.quillJS.deleteText(startIndex, annotatedText.length);
						setTimeout(() => {
							this.quillJS.insertText(startIndex, matchedText, { bold: true }, 'silent');
							this.quillJS.format('bold', false);
							resolve(true);
						});
					}, 0);
				})
		};
	}
}

export default Bold;
