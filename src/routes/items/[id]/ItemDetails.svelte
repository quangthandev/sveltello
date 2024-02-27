<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { clickOutside } from '$lib/actions/click-outside';
	import type { Column, Item } from '@prisma/client';
	import EditableText from '../../boards/[id]/EditableText.svelte';

	export let id: string;

	let isEditing = false;

	const query = createQuery<Item & { column: Column }>({
		queryKey: ['items', id],
		queryFn: async () => {
			const res = await fetch(`/items/${id}`);
			return res.json();
		},
		initialData: $page.data.item
	});

	const queryClient = useQueryClient();
</script>

<div class="p-6">
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
			class="h-5 w-5 mt-1 text-neutral-700"
		>
			<rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
			<line x1="3" x2="21" y1="9" y2="9"></line>
			<line x1="9" x2="9" y1="21" y2="9"></line>
		</svg>
		<div class="-mt-1">
			<h3>
				<EditableText
					action="?/updateItemTitle"
					invalidateAll={false}
					on:submitted={() => {
						queryClient.invalidateQueries({
							queryKey: ['items', $query.data?.id]
						});
						queryClient.invalidateQueries({
							queryKey: ['boards', $query.data?.boardId.toString()]
						});
					}}
					fieldName="title"
					value={$query.data?.title || ''}
					inputClassName="text-xl border border-slate-400 w-full rounded-lg py-1 px-2 font-medium"
					buttonClassName="text-xl block rounded-lg text-left w-full border border-transparent py-1 px-2 font-medium text-slate-600"
				>
					<input type="hidden" name="id" value={$page.params.id} />
				</EditableText>
			</h3>
			<p class="text-sm text-muted-foreground px-3">
				in list <span class="underline">{$query.data?.column.name || ''}</span>
			</p>
		</div>
	</div>
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
								queryKey: ['items', $query.data?.id]
							});
							queryClient.invalidateQueries({
								queryKey: ['boards', $query.data?.boardId.toString()]
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
					<!-- svelte-ignore a11y-autofocus -->
					<textarea
						name="content"
						class="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium"
						autofocus
						value={$query.data?.content || ''}
					/>
					<input type="hidden" name="id" value={$page.params.id} />
					<div class="flex items-center gap-x-2">
						<button type="submit" class="bg-blue-600 text-white rounded-lg py-2 px-4 font-medium">
							Save
						</button>
						<button on:click={() => (isEditing = false)}>Cancel</button>
					</div>
				</form>
			{:else}
				<p class="min-h-[40px] bg-neutral-200 font-medium py-3 px-3.5 rounded-md">
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a href="#" class="block min-h-[40px]" on:click|preventDefault={() => (isEditing = true)}>
						{$query.data?.content || 'Add a more detailed description...'}
					</a>
				</p>
			{/if}
		</div>
	</div>
	<div class="flex items-start gap-x-2 w-full">
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
			<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
		</svg>
		<div class="px-2 w-full">
			<h3 class="text-xl font-medium mb-4">Activity</h3>
		</div>
	</div>
</div>
