import type { Range } from 'quill/core/selection';

export type TagPattern = RegExp | ((value: string) => string | null);

export type Tag<T extends TagPattern = TagPattern> = {
	name: string;
	pattern: T;
	action: (text: string, selection: Range, pattern: T, lineStart: number) => Promise<boolean>;
	release?: (selection: Range) => void;
};

export interface TagImpl<T extends TagPattern = TagPattern> {
	getAction: () => Tag<T>;
}

export type Options<T extends TagPattern = TagPattern> = {
	ignoreTags?: string[];
	tags?: {
		[key: string]: Pick<Tag<T>, 'pattern'>;
	};
};
