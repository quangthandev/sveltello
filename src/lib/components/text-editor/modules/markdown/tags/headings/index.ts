import AbstractTag from '../AbstractTag';
import type Quill from 'quill';
import meta from '../meta';
import type { Options, Tag, TagImpl, TagPattern } from '../../types';

class Heading extends AbstractTag implements TagImpl {
	private quillJS: Quill;
	private name: string;
	private pattern: TagPattern;
	private _meta: ReturnType<typeof meta>;
	private activeTags: string[];

	constructor(quillJS: Quill, options: Options = {}) {
		super();
		this.quillJS = quillJS;
		this.name = 'heading';
		this.pattern = this._getCustomPatternOrDefault(options, this.name, /^(#){1,6}\s/g);
		this.getAction.bind(this);
		this._meta = meta(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
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
					if (
						!match ||
						!this.activeTags.length ||
						!this.activeTags.find((tag) => tag === 'heading')
					) {
						resolve(false);
						return;
					}
					const size = match[0].length;
					const [line] = this.quillJS.getLine(selection.index);
					const index = this.quillJS.getIndex(line!);

					if (!this.activeTags.includes(`h${size - 1}`)) {
						return resolve(false);
					}

					setTimeout(() => {
						this.quillJS.formatLine(index, 0, 'heading', size - 1);
						this.quillJS.deleteText(index, size);
						resolve(true);
					}, 0);
				})
		};
	}
}

export default Heading;
