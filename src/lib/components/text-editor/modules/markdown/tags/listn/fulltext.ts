import type Quill from 'quill';
import AbstractTag from '../AbstractTag';
import meta from '../meta';
import type { Options, Tag, TagImpl, TagPattern } from '../../types';

class Link extends AbstractTag implements TagImpl {
	quillJS: Quill;
	name: string;
	pattern: TagPattern;
	_meta: ReturnType<typeof meta>;
	activeTags: string[];

	constructor(quillJS: Quill, options: Options = {}) {
		super();
		this.quillJS = quillJS;
		this.name = 'li';
		this.pattern = this._getCustomPatternOrDefault(options, this.name, /^\s{0,9}(\d)+\.\s/g);
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
					const [line] = this.quillJS.getLine(selection.index);
					const index = this.quillJS.getIndex(line!);
					setTimeout(() => {
						const depth = text
							.split('. ')[0]
							.split('')
							.filter((e) => /\s/gi.test(e)).length;
						const replaceText = text.split('. ').splice(1, 1).join('');
						this.quillJS.insertText(index, replaceText, 'user');
						this.quillJS.deleteText(index + replaceText.length - 1, text.length);
						setTimeout(() => {
							this.quillJS.formatLine(index, 0, { list: 'ordered', indent: depth });
							resolve(true);
						}, 0);
					}, 0);
				})
		};
	}
}

export default Link;
