<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ActionReturn } from 'svelte/action';
	import type Quill from 'quill';
	import type { Delta } from 'quill/core';
	import type { EmitterSource } from 'quill/core/emitter';
	import type { Range } from 'quill/core/selection';
	import QuillMarkdown from './modules/markdown';

	interface StringMap {
		[key: string]: any;
	}

	interface QuillOptionsStatic {
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

	export let initialContent: string | null = '';
	export let options: QuillOptionsStatic = {};
	export let autofocus: boolean = false;

	let quill: Quill;
	let editor: HTMLDivElement;

	const dispatch = createEventDispatcher<{
		initialized: Quill;
		'text-change': { delta: Delta; oldContent: Delta; source: EmitterSource };
		'selection-change': { range: Range; oldRange: Range; source: EmitterSource };
	}>();

	const defaultOptions: QuillOptionsStatic = {
		modules: {
			toolbar: [
				['bold', 'italic'],
				['link', 'blockquote', 'code-block', 'image'],
				[{ list: 'ordered' }, { list: 'bullet' }]
			]
		},
		theme: 'snow'
	};

	type TextEditorOptions = QuillOptionsStatic;

	interface TextEditorAttributes {}

	function quillEditor(
		node: HTMLDivElement,
		options?: QuillOptionsStatic
	): ActionReturn<TextEditorOptions, TextEditorAttributes> {
		import('quill').then(({ default: Quill }) => {
			Quill.register({
				'modules/quillMarkdown': QuillMarkdown
			});
			quill = new Quill(node, {
				...defaultOptions,
				...options,
				modules: {
					...defaultOptions.modules,
					quillMarkdown: true
				}
			});

			dispatch('initialized', quill);

			if (initialContent) {
				if (typeof initialContent === 'string') {
					quill.setContents(
						quill.clipboard.convert({
							html: initialContent,
							text: initialContent
						}),
						'silent'
					);
				} else {
					quill.setContents(initialContent, 'silent');
				}

				// Clear history to prevent undoing initial content
				quill.history.clear();
			}

			if (autofocus) {
				quill.focus();

				// Move cursor to the end
				const length = quill.getLength();
				quill.setSelection(length, length);
			}

			// Set up event listeners
			quill.on('text-change', handleTextChange);
			quill.on('selection-change', handleSelectionChange);
		});

		function handleTextChange(delta: Delta, oldContent: Delta, source: EmitterSource) {
			dispatch('text-change', { delta, oldContent, source });
		}

		function handleSelectionChange(range: Range, oldRange: Range, source: EmitterSource) {
			dispatch('selection-change', { range, oldRange, source });
		}

		return {
			update(newOptions) {
				options = newOptions;
			},
			destroy() {
				// Remove event listeners
				quill.off('text-change', handleTextChange);
				quill.off('selection-change', handleSelectionChange);
			}
		};
	}

	export function getContents() {
		return quill.getContents();
	}

	export function getHTML() {
		return quill.getSemanticHTML();
	}

	export function getEditor() {
		if (!quill) {
			throw new Error('Quill editor is not initialized');
		}

		return quill;
	}

	export function focus() {
		if (!quill) return;
		quill.focus();
	}

	export function hasFocus() {
		if (!quill) return false;
		return quill.hasFocus();
	}

	export function blur() {
		if (!quill) return;
		quill.blur();
	}
</script>

<div bind:this={editor} use:quillEditor={options} {...$$restProps} />

<style>
	@import url('https://cdn.jsdelivr.net/npm/quill@2.0.0-rc.2/dist/quill.snow.css');
</style>
