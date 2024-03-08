<script lang="ts">
	import { enhance } from '$app/forms';
	import { clickOutside } from '$lib/actions/click-outside';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { tick } from 'svelte';

	export let id: string;
	export let boardId: string;
	export let content: string | null;

	let isEditing = false;
	let contentEl: HTMLTextAreaElement;

	const queryClient = useQueryClient();
</script>

<div class="flex items-start gap-x-2 mb-8 w-full">
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
		<h3 class="text-xl font-medium mb-4">Description</h3>
		{#if isEditing}
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<form
				action="?/updateItemContent"
				method="POST"
				use:enhance={() => {
					return async ({ update }) => {
						await update({ invalidateAll: false });

						isEditing = false;

						queryClient.invalidateQueries({
							queryKey: ['items', id]
						});
						queryClient.invalidateQueries({
							queryKey: ['boards', boardId]
						});
					};
				}}
				on:keydown={(e) => {
					if (e.key === 'Escape') {
						e.stopPropagation();

						isEditing = false;
					}
				}}
				use:clickOutside
				on:clickOutside={() => (isEditing = false)}
			>
				<textarea
					bind:this={contentEl}
					name="content"
					class="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium"
					value={content}
					rows="6"
				/>
				<input type="hidden" name="id" value={id} />
				<div class="flex items-center gap-x-2">
					<button type="submit" class="bg-blue-600 text-white rounded-lg py-2 px-4 font-medium">
						Save
					</button>
					<button on:click={() => (isEditing = false)}>Cancel</button>
				</div>
			</form>
		{:else}
			<p class="relative min-h-[60px] font-medium rounded-md">
				<button
					class="absolute inset-0 text-left px-4 bg-gray-200 hover:bg-gray-300"
					aria-label="Edit description"
					on:click|preventDefault={async () => {
						isEditing = true;
						await tick();
						contentEl.focus();
					}}
				>
					{content || 'Add a more detailed description...'}
				</button>
			</p>
		{/if}
	</div>
</div>
