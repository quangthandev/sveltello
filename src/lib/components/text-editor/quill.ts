import type { BlotConstructor } from 'parchment';
import QuillMarkdown from './modules/markdown';
import ImageUploader from './modules/image-uploader';
import type { Context } from 'quill/modules/keyboard';
import type { Range } from 'quill/core/selection';

interface StringMap {
	[key: string]: unknown;
}

export interface QuillOptionsStatic {
	debug?: boolean;
	modules?: StringMap | undefined;
	placeholder?: string | undefined;
	readOnly?: boolean | undefined;
	theme?: string | undefined;
	formats?: string[] | undefined;
	bounds?: HTMLElement | string | undefined;
	scrollingContainer?: HTMLElement | string | undefined;
	strict?: boolean | undefined;
}

export type Options = QuillOptionsStatic & { imageUploader?: (file: File) => Promise<string> };

export async function initQuill(node: HTMLElement, options?: Options) {
	const { default: Quill } = await import('quill');

	// Register horizontal rule blot
	const BlockEmbed = Quill.import('blots/block/embed') as BlotConstructor;
	class HorizontalRuleBlot extends BlockEmbed {
		static blotName = 'hr';
		static tagName = 'hr';
	}
	Quill.register(HorizontalRuleBlot, true);

	// Register loading image blot
	const InlineBlot = Quill.import('blots/block') as BlotConstructor;

	class LoadingImage extends InlineBlot {
		cache: object = {};

		static create(src: string) {
			const node = super.create(src);
			// if (src) return node;

			const image = document.createElement('img');
			image.setAttribute('src', src);
			node.appendChild(image);
			return node;
		}
		deleteAt(index: number, length: number) {
			super.deleteAt(index, length);
			this.cache = {};
		}
		static value(domNode: HTMLElement) {
			const { src, custom } = domNode.dataset;
			return { src, custom };
		}
		static blotName = 'imageBlot';
		static className = 'quill-image-uploading';
		static tagName = 'span';
	}
	Quill.register({ 'formats/imageBlot': LoadingImage });

	// Register Quill Markdown module
	Quill.register({
		'modules/quillMarkdown': QuillMarkdown
	});

	// Register image uploader module
	Quill.register({
		'modules/imageUploader': ImageUploader
	});

	const defaultOptions: QuillOptionsStatic = {
		modules: {
			toolbar: [
				[{ header: [false, 1, 2, 3, 4, 5, 6] }],
				['bold', 'italic', 'strike', 'code'],
				['link', 'blockquote', 'code-block', 'image'],
				[{ list: 'ordered' }, { list: 'bullet' }]
			],
			keyboard: {
				bindings: {
					custom: {
						key: ['Backspace', 'Delete'],
						handler: (range: Range, context: Context) => {
							// Remove formatting when deleting at the beginning of a line and the line is empty
							if (range.index === 0 && range.length === 0 && context.empty && context.format) {
								quill.removeFormat(range, context.format);
								return false;
							}

							return true;
						}
					}
				}
			}
		},
		theme: 'snow'
	};

	const quill = new Quill(node, {
		...defaultOptions,
		...options,
		modules: {
			...defaultOptions.modules,
			quillMarkdown: {},
			imageUploader: {
				upload: options?.imageUploader ? options.imageUploader : undefined,
				blotName: 'imageBlot'
			}
		}
	});

	return quill;
}
