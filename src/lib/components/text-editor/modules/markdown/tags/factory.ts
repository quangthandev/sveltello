import type Quill from 'quill';
import type { Range } from 'quill/core/selection';

export type TagName =
	| 'bold'
	| 'italic'
	| 'strikethrough'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'blockquote'
	| 'pre'
	| 'code'
	| 'link'
	| 'hr'
	| 'ol'
	| 'ul';

type QuillFormat =
	| 'bold'
	| 'italic'
	| 'strike'
	| 'header' // quill calls it "header" to format headings
	| 'blockquote'
	| 'code-block'
	| 'code'
	| 'link'
	| 'hr'
	| 'ordered' // numbered list
	| 'bullet'; // bullet list

interface FormatterAttributes {
	quill: Quill;
	text: string;
	match: RegExpExecArray;
	selection: Range;
	lineStart: number;
}

export class Tag<T extends QuillFormat = QuillFormat> {
	formatter: (params: FormatterAttributes) => void;

	constructor(
		public format: T,
		public pattern: RegExp,
		public tagNames: TagName[],
		formatter: (format: T, pattern: RegExp) => (params: FormatterAttributes) => void,
		private customMatcher?: (
			text: string,
			pattern: RegExp,
			lineStart?: number
		) => RegExpExecArray | null
	) {
		this.format = format;
		this.pattern = pattern;
		this.formatter = formatter(this.format, this.pattern);
	}

	match(text: string, lineStart: number) {
		if (this.customMatcher) {
			return this.customMatcher(text, this.pattern, lineStart);
		}

		return this.pattern.exec(text);
	}
}

export function createTag<T extends QuillFormat>(params: {
	format: T;
	pattern: RegExp;
	tagNames: TagName[];
	formatter: (format: T, pattern: RegExp) => (params: FormatterAttributes) => void;
	customMatcher?: (text: string, pattern: RegExp, lineStart?: number) => RegExpExecArray | null;
}) {
	const { format, pattern, tagNames, formatter, customMatcher } = params;
	return new Tag(format, pattern, tagNames, formatter, customMatcher);
}
