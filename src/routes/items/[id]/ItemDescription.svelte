<script lang="ts">
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { clickOutside } from '$lib/actions/click-outside';
	import { escapeKeydown } from '$lib/actions/escape-keydown';
	import TextEditor from '$lib/components/text-editor';
	import { queriesCtx } from './context';
	import TurndownService from 'turndown';
	import markdownit from 'markdown-it';
	import type { TypedSubmitFunction } from '$lib/form';
	import type { ActionData } from './$types';

	export let id: string;
	export let boardId: string;
	export let content: string | null;

	let isEditing = false;
	let isSubmitting = false;
	let textEditor: TextEditor;

	const queryClient = useQueryClient();

	const { uploadImage } = queriesCtx.get();

	const turndownService = new TurndownService();
	const md = markdownit();

	const handleSubmit: TypedSubmitFunction<ActionData> = async ({ formData }) => {
		isSubmitting = true;

		const html = textEditor.getHTML();
		const markdown = turndownService.turndown(html);

		formData.append('content', markdown);

		return async ({ update }) => {
			await update({ invalidateAll: false });

			isSubmitting = false;
			isEditing = false;

			queryClient.invalidateQueries({
				queryKey: ['items', id]
			});
			queryClient.invalidateQueries({
				queryKey: ['boards', boardId]
			});
		};
	};
</script>

<section class="relative grid grid-cols-item-section items-start w-full">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="h-5 w-5 mt-0.5 text-neutral-700"
	>
		<line x1="21" x2="3" y1="6" y2="6"></line>
		<line x1="15" x2="3" y1="12" y2="12"></line>
		<line x1="17" x2="3" y1="18" y2="18"></line>
	</svg>
	<div class="px-2 w-full">
		<h3 class="text-xl font-medium mb-3">Description</h3>
		{#if isEditing}
			<form
				action="?/updateItemContent"
				method="POST"
				use:enhance={handleSubmit}
				use:escapeKeydown={{
					handler: () => (isEditing = false)
				}}
				use:clickOutside={{
					handler: (e) => {
						e.preventDefault();
						e.stopPropagation();

						if (textEditor.hasFocus()) return;

						isEditing = false;
					}
				}}
			>
				<TextEditor
					class="bg-white min-h-48"
					options={{
						placeholder: 'Add a more detailed description...',
						imageUploader: async (file) => {
							const res = await $uploadImage.mutateAsync({ itemId: id, file });

							// TODO: figure out why invalidating the query forces the editor to re-render
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
						disabled={isSubmitting}
					>
						Save
					</button>
					<button
						on:click={() => (isEditing = false)}
						class="px-4 py-2 font-medium rounded-md hover:bg-gray-300">Cancel</button
					>
				</div>
			</form>
		{:else}
			<div class="relative min-h-[60px] font-medium rounded-md item-description">
				{#if content !== null && content.trim() !== ''}
					{@html md.render(content)}
				{:else}
					<button
						class="absolute inset-0 text-left px-4 bg-gray-200 hover:bg-gray-300"
						aria-label="Edit description"
						on:click|preventDefault={() => (isEditing = true)}
					>
						{'Add a more detailed description...'}
					</button>
				{/if}
			</div>
		{/if}

		{#if content !== null && content.trim() !== '' && !isEditing}
			<button
				class="absolute top-0 right-4 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
				on:click={() => (isEditing = true)}
			>
				Edit
			</button>
		{/if}
	</div>
</section>
