<script lang="ts">
	import type { ActionReturn } from 'svelte/action';
	import type Quill from 'quill';
	import type { Delta } from 'quill/core';
	import type { EmitterSource } from 'quill/core/emitter';
	import type { Range } from 'quill/core/selection';
	import { initQuill, type Options as TextEditorOptions } from './quill';
	import type { HTMLAttributes } from 'svelte/elements';

	type TextChangeData = { delta: Delta; oldContent: Delta; source: EmitterSource };
	type SelectionChangeData = { range: Range; oldRange: Range; source: EmitterSource };

	interface Props extends HTMLAttributes<HTMLDivElement> {
		initialContent?: string | null;
		options?: TextEditorOptions;
		autofocus?: boolean;
		onTextChange?: (data: TextChangeData) => void;
		onSelectionChange?: (data: SelectionChangeData) => void;
	}

	let {
		initialContent = '',
		options = {},
		autofocus = false,
		onTextChange,
		onSelectionChange,
		...rest
	}: Props = $props();

	let quillInstance: Quill;
	let editor = $state<HTMLDivElement>();

	interface TextEditorAttributes {}

	function quillEditor(
		node: HTMLDivElement,
		options?: TextEditorOptions
	): ActionReturn<TextEditorOptions, TextEditorAttributes> {
		initQuill(node, options).then((quill) => {
			quillInstance = quill;

			if (initialContent) {
				if (typeof initialContent === 'string') {
					quillInstance.setContents(
						quillInstance.clipboard.convert({
							html: initialContent,
							text: initialContent
						}),
						'silent'
					);
				} else {
					quillInstance.setContents(initialContent, 'silent');
				}

				// Clear history to prevent undoing initial content
				quillInstance.history.clear();
			}

			if (autofocus) {
				quillInstance.focus();

				// Move cursor to the end
				const length = quillInstance.getLength();
				quillInstance.setSelection(length, length);
			}

			// Set up event listeners
			quillInstance.on('text-change', handleTextChange);
			quillInstance.on('selection-change', handleSelectionChange);
		});

		function handleTextChange(delta: Delta, oldContent: Delta, source: EmitterSource) {
			onTextChange?.({ delta, oldContent, source });
		}

		function handleSelectionChange(range: Range, oldRange: Range, source: EmitterSource) {
			onSelectionChange?.({ range, oldRange, source });
		}

		return {
			update(newOptions) {
				options = newOptions;
			},
			destroy() {
				// Remove event listeners
				quillInstance.off('text-change', handleTextChange);
				quillInstance.off('selection-change', handleSelectionChange);
			}
		};
	}

	export function getContents() {
		return quillInstance.getContents();
	}

	export function getHTML() {
		return quillInstance.getSemanticHTML();
	}

	export function getEditor() {
		if (!quillInstance) {
			throw new Error('Quill editor is not initialized');
		}

		return quillInstance;
	}

	export function focus() {
		if (!quillInstance) return;
		quillInstance.focus();
	}

	export function hasFocus() {
		if (!quillInstance) return false;
		return quillInstance.hasFocus();
	}

	export function blur() {
		if (!quillInstance) return;
		quillInstance.blur();
	}
</script>

<div bind:this={editor} use:quillEditor={options} {...rest}></div>

<style>
	@import url('https://cdn.jsdelivr.net/npm/quill@2.0.0/dist/quill.snow.css');
</style>
