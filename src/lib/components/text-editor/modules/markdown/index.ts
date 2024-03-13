// Reference: https://github.com/cloverhearts/quilljs-markdown

import TagsOperators from './tags';
import type Quill from 'quill';
import type { Delta, Op } from 'quill/core';
import type { EmitterSource } from 'quill/core/emitter';
import type { Range } from 'quill/core/selection';
import type { Options, Tag } from './types';

class QuillMarkdown {
	options: Options<RegExp>;
	private handleTextChangeBound: (delta: Delta, oldContent: Delta, source: EmitterSource) => void;
	private actionCharacters: {
		whiteSpace: string;
		newLine: string;
		asterisk: string;
		rightParenthesis: string;
		grave: string;
		tilde: string;
		underscore: string;
	};
	ignoreTags: string[];
	tags: TagsOperators;
	private matches: Tag[];
	private fullMatches: Tag[];

	constructor(
		private quillJS: Quill,
		options: Options<RegExp> = {}
	) {
		this.quillJS = quillJS;
		this.options = options;
		this.handleTextChangeBound = this.handleTextChange.bind(this);
		this.quillJS.on('text-change', this.handleTextChangeBound);
		this.actionCharacters = {
			whiteSpace: ' ',
			newLine: '\n',
			asterisk: '*',
			rightParenthesis: ')',
			grave: '`',
			tilde: '~',
			underscore: '_'
		};
		this.ignoreTags = ['PRE'].concat(options.ignoreTags ?? []);
		this.tags = new TagsOperators(this.quillJS, options);
		this.matches = this.tags.getOperatorsAll();
		this.fullMatches = this.tags.getFullTextOperatorsAll();
	}

	destroy() {
		this.quillJS.off('text-change', this.handleTextChangeBound);
	}

	handleTextChange(delta: Delta, _oldContent: Delta, source: EmitterSource) {
		if (source !== 'user') return;

		const cursorOffset = typeof delta.ops[0].retain === 'number' ? delta.ops[0].retain : 0;
		const inputText = delta.ops[0].insert || (delta.ops[1] && delta.ops[1].insert);
		const [removeLine] = this.quillJS.getLine(cursorOffset);
		const insertDelta =
			delta.ops.find((op) => Object.prototype.hasOwnProperty.call(op, 'insert')) || {};
		const isRemoveCommand =
			delta.ops.find((op) => Object.prototype.hasOwnProperty.call(op, 'delete')) ||
			insertDelta.insert === '\n';
		if (
			isRemoveCommand &&
			removeLine &&
			typeof removeLine.domNode?.textContent === 'string' &&
			removeLine.domNode.textContent.length <= 1
		) {
			const rangeElements = ['PRE', 'BLOCKQUOTE'];
			if (rangeElements.includes(removeLine.domNode.tagName)) {
				this.handleRemoveElement({ delete: 1 });
			}
		}

		if (!inputText) {
			return;
			// } else if (typeof inputText === 'string' && inputText.length > 1) {
			// 	setTimeout(async () => {
			// 		const cursorOffsetFixed = cursorOffset;
			// 		const tokens = inputText.split('\n');
			// 		let _offset = cursorOffsetFixed;
			// 		// eslint-disable-next-line @typescript-eslint/no-unused-vars
			// 		for (const _ of tokens) {
			// 			const [line] = this.quillJS.getLine(_offset);
			// 			if (!line) {
			// 				return 0;
			// 			}
			// 			const firstIndex = this.quillJS.getIndex(line);
			// 			let _targetText = '';
			// 			let result = await this.handleFullTextExecute.bind(this)({
			// 				index: firstIndex,
			// 				delta,
			// 				length: 0
			// 			});
			// 			if (result) {
			// 				while (result) {
			// 					const [line] = this.quillJS.getLine(_offset);
			// 					const firstIndex = this.quillJS.getIndex(line!);
			// 					if (!line || !line.domNode) {
			// 						result = false;
			// 						break;
			// 					}
			// 					_targetText = line.domNode.textContent || '';
			// 					result = await this.handleFullTextExecute.bind(this)({
			// 						index: firstIndex,
			// 						delta,
			// 						length: 0
			// 					});
			// 				}
			// 			} else {
			// 				_targetText = line.domNode.textContent || '';
			// 			}
			// 			_offset += _targetText.length + 1;
			// 		}
			// 	}, 0);
			// 	return;
		}

		delta.ops
			.filter((e) => Object.prototype.hasOwnProperty.call(e, 'insert'))
			.forEach((e) => {
				switch (e.insert) {
					case this.actionCharacters.whiteSpace:
					case this.actionCharacters.rightParenthesis:
					case this.actionCharacters.asterisk:
					case this.actionCharacters.grave:
					case this.actionCharacters.newLine:
					case this.actionCharacters.tilde:
					case this.actionCharacters.underscore:
						this.quillJS.history.cutoff();
						this.handleInlineExecute.bind(this)();
						break;
				}
			});

		delta.ops
			.filter((e) => Object.prototype.hasOwnProperty.call(e, 'delete'))
			.forEach((e) => {
				this.handleRemoveElement(e);
			});
	}

	handleInlineExecute() {
		const selection = this.quillJS.getSelection();
		if (!selection) return;
		const [line, offset] = this.quillJS.getLine(selection.index);
		const text = line?.domNode.textContent || '';
		const lineStart = selection.index - offset;
		const format = this.quillJS.getFormat(lineStart);
		if (format['code-block'] || format['code']) {
			// if exists text in code-block, to skip.
			return;
		}
		for (const match of this.matches) {
			const matchedText =
				typeof match.pattern === 'function' ? match.pattern(text) : text.match(match.pattern);
			if (matchedText) {
				return match.action(text, selection, match.pattern, lineStart);
			}
		}
	}

	async handleFullTextExecute(virtualSelection: Range & { delta: Delta }): Promise<boolean> {
		const selection = virtualSelection || this.quillJS.getSelection();
		const delta = virtualSelection.delta;
		if (!selection) return false;
		const [line, offset] = this.quillJS.getLine(selection.index);

		if (!line || offset < 0) return false;
		const retain = (delta && delta.ops && (delta.ops[0].retain as number)) || 0;
		const lineStart = selection.index - offset;
		const formatLineStart = retain ? retain - 1 : lineStart;
		const format = this.quillJS.getFormat(formatLineStart);
		if (format['code-block'] || format['code']) {
			// if exists text in code-block, to skip.

			if (format['code']) {
				// ignore all styles when copied text in code block.
				const copiedTexts = delta.ops
					.filter((d) => d.insert)
					.map((d) => d.insert)
					.join('');
				this.quillJS.deleteText(retain, copiedTexts.length);
				this.quillJS.insertText(
					retain,
					copiedTexts.replace(/\n/g, ''),
					{
						code: true
					},
					'silent'
				);
				this.quillJS.format('code', false);
			}
			return false;
		}
		const beforeNode = this.quillJS.getLine(lineStart - 1)[0];
		const beforeLineText = beforeNode && beforeNode.domNode.textContent;
		const text = line.domNode.textContent + ' ';
		selection.length = selection.index++;
		// remove block rule.
		if (typeof beforeLineText === 'string' && beforeLineText.length > 0 && text === ' ') {
			const releaseTag = this.fullMatches.find(
				(e) => e.name === line.domNode.tagName.toLowerCase()
			);
			if (releaseTag && releaseTag.release) {
				releaseTag.release(selection);
				return false;
			}
		}

		for (const match of this.fullMatches) {
			const matchedText =
				typeof match.pattern === 'function' ? match.pattern(text) : text.match(match.pattern);
			if (matchedText) {
				return await match.action(text, selection, match.pattern, lineStart);
			}
		}
		return false;
	}

	handleRemoveElement(range: Op) {
		const selection = this.quillJS.getSelection();
		// if removed one item before, editor need to clear item.
		if (range && range.delete === 1) {
			const removeItem = this.quillJS.getLine(selection!.index);
			const lineItem = removeItem[0];
			const releaseTag = this.matches.find(
				(e) => e.name === lineItem!.domNode.tagName.toLowerCase()
			);
			if (releaseTag && releaseTag.release) {
				releaseTag.release(selection!);
			}
		}
	}
}

export default QuillMarkdown;
