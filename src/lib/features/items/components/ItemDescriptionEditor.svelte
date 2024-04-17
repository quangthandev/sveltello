<script lang="ts">
	import { enhance } from '$app/forms';
	import TextEditor from '$lib/components/text-editor/TextEditor.svelte';
	import type { TypedSubmitFunction } from '$lib/form';
	import TurndownService from 'turndown';
	import markdownit from 'markdown-it';
	import { escapeKeydown } from '$lib/actions/escape-keydown';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { clickOutside } from '$lib/actions/click-outside';
	import { createEventDispatcher } from 'svelte';
	import type { ActionData } from '../../../../routes/items/[id]/$types';
	import { useUploadImage } from '../query-client/mutations';

	export let id: string;
	export let boardId: number;
	export let content: string | null;

	let isSubmitting = false;
	let textEditor: TextEditor;

	const dispatch = createEventDispatcher();

	const turndownService = new TurndownService();
	const md = markdownit();

	const queryClient = useQueryClient();

	const uploadImageMutation = useUploadImage();

	const handleSubmit: TypedSubmitFunction<ActionData> = async ({ formData }) => {
		isSubmitting = true;

		const html = textEditor.getHTML();
		const markdown = turndownService.turndown(html);

		formData.append('content', markdown);

		return async ({ update }) => {
			await update({ invalidateAll: false });

			isSubmitting = false;
			dispatch('close');

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
		handler: () => dispatch('close')
	}}
	use:clickOutside={{
		handler: (e) => {
			e.preventDefault();
			e.stopPropagation();

			if (textEditor.hasFocus()) return;

			dispatch('close');
		}
	}}
>
	<TextEditor
		class="bg-white min-h-48"
		options={{
			placeholder: 'Add a more detailed description...',
			imageUploader: async (file) => {
				const res = await $uploadImageMutation.mutateAsync({ itemId: id, file });

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
		<button
			type="submit"
			class="bg-blue-600 text-white rounded-md py-2 px-4 font-medium disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed"
			disabled={isSubmitting || $uploadImageMutation.isPending}
		>
			Save
		</button>
		<button
			on:click={() => dispatch('close')}
			class="px-4 py-2 font-medium rounded-md hover:bg-gray-300">Cancel</button
		>
	</div>
</form>
