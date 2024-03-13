import type Quill from 'quill';
import AbstractTag from '../AbstractTag';
import meta from '../meta';
import type { Options, Tag, TagImpl, TagPattern } from '../../types';

class InlineCode extends AbstractTag implements TagImpl {
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
		this.name = 'code';
		this.pattern = this._getCustomPatternOrDefault(options, this.name, (value: string) => {
			return /(`){1}(.+)(`){1}/g.test(value) && !/```.*/.test(value) ? value : null;
		});
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
			action: (text, selection, pattern, lineStart) =>
				new Promise((resolve) => {
					const match = /(`){1}(.+)(`){1}/g.exec(text);
					if (!match || !this.activeTags.length) {
						resolve(false);
						return;
					}

					const [annotatedText] = match;
					const startIndex = lineStart + match.index;
					setTimeout(() => {
						this.quillJS.deleteText(startIndex, annotatedText.length);
						setTimeout(() => {
							const message = annotatedText.replace(/`/g, '');
							this.quillJS.insertText(startIndex, message, { code: true }, 'user');
							this.quillJS.insertText(
								startIndex + message.length,
								' ',
								{
									code: false
								},
								'user'
							);
							resolve(true);
						}, 0);
					}, 0);
				})
		};
	}
}

export default InlineCode;
