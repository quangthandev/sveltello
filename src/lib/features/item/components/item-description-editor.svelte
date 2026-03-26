<script lang="ts">
	import { enhance } from '$app/forms';
	import TextEditor from '$lib/components/text-editor/text-editor.svelte';
	import type { TypedSubmitFunction } from '$lib/form';
	import TurndownService from 'turndown';
	import markdownit from 'markdown-it';
	import { escapeKeydown } from '$lib/actions/escape-keydown';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { clickOutside } from '$lib/actions/click-outside';
	import Button from '$lib/components/ui/button/button.svelte';
	import { useUploadImage } from '../query-client/item.mutations';
	import type { ActionData } from '../../../../routes/(user)/items/[id]/$types';

	interface Props {
		id: string;
		boardId: number;
		content: string | null;
		onClose: () => void;
	}

	let { id, boardId, content, onClose }: Props = $props();

	let isSubmitting = $state(false);
	let textEditor = $state<ReturnType<typeof TextEditor> | null>(null);

	const turndownService = new TurndownService({ codeBlockStyle: 'fenced' });
	turndownService.addRule('codeblock', {
		filter: ['pre'],
		replacement: function (content) {
			return '```\n' + content.trim() + '\n```';
		}
	});
	const md = markdownit();

	const queryClient = useQueryClient();

	const uploadImageMutation = $derived(useUploadImage(id, boardId));

	const handleSubmit: TypedSubmitFunction<ActionData> = async ({ formData }) => {
		if (!textEditor) return;

		isSubmitting = true;

		let html = textEditor.getHTML();

		const markdown = turndownService.turndown(html);

		formData.append('content', markdown);

		return async ({ update }) => {
			await update({ invalidateAll: false });

			isSubmitting = false;
			onClose();

			queryClient.invalidateQueries({
				queryKey: ['items', id]
			});
			queryClient.invalidateQueries({
				queryKey: ['boards', boardId]
			});
		};
	};
</script>

<form
	action="?/updateItemContent"
	method="POST"
	use:enhance={handleSubmit}
	use:escapeKeydown={{
		handler: onClose
	}}
	use:clickOutside={{
		handler: (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (textEditor?.hasFocus()) return;

			onClose();
		}
	}}
>
	<TextEditor
		class="bg-white min-h-48"
		options={{
			placeholder: 'Add a more detailed description...',
			imageUploader: async (file) => {
				const res = await uploadImageMutation.mutateAsync(file);

				queryClient.invalidateQueries({ queryKey: ['items', id] });

				return res.url;
			}
		}}
		initialContent={md.render(content ?? '')}
		autofocus={true}
		bind:this={textEditor}
	/>
	<input type="hidden" name="id" value={id} />
	<div class="flex items-center gap-x-2 mt-2">
		<Button type="submit" disabled={isSubmitting || uploadImageMutation.isPending}>Save</Button>
		<Button
			variant="ghost"
			onclick={onClose}
			class="px-4 py-2 font-medium rounded-md hover:bg-gray-300">Cancel</Button
		>
	</div>
</form>
