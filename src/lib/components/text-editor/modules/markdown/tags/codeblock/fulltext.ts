import type Quill from 'quill';
import AbstractTag from '../AbstractTag';
import type { Options, Tag, TagImpl, TagPattern } from '../../types';
import meta from '../meta';

class Codeblock extends AbstractTag implements TagImpl {
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
		this.name = 'pre';
		this.pattern = this._getCustomPatternOrDefault(options, this.name, /^(```)/g);
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
					const [line] = this.quillJS.getLine(selection.index);
					setTimeout(() => {
						const startIndex = this.quillJS.getIndex(line!);
						this.quillJS.deleteText(startIndex, originalText.length + 1);
						setTimeout(() => {
							let line = this.quillJS.getLine(startIndex)[0];
							while (line) {
								const lineOffset = this.quillJS.getIndex(line);
								const _text = line.domNode.textContent || '';
								const offsetText = line.domNode.textContent?.length || 0;
								const isBreak = (this.pattern as RegExp).test(_text!);
								if (isBreak) {
									this.quillJS.deleteText(lineOffset, _text.length);
									resolve(true);
									return;
								}
								this.quillJS.formatLine(lineOffset, 0, 'code-block', true);
								line = this.quillJS.getLine(lineOffset + offsetText + 1)[0];
							}
							resolve(true);
						}, 0);
					}, 0);
				}),
			release: () => {
				setTimeout(() => {
					const cursorIndex = this.quillJS.getSelection()?.index || 0;
					const block = this.quillJS.getLine(cursorIndex)[0];
					const blockText = block!.domNode.textContent;
					if (block && blockText && blockText.replace('\n', '').length <= 0) {
						this.quillJS.format('code-block', false);
					}
				}, 0);
			}
		};
	}
}

export default Codeblock;
