<script lang="ts">
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import ItemDescriptionEditor from './ItemDescriptionEditor.svelte';
	import ItemDescriptionContent from './ItemDescriptionContent.svelte';
	import type { ItemFullPayload } from '$lib/types';

	export let item: ItemFullPayload | undefined;
	export let isLoading = false;

	let isEditing = false;
</script>

<section class="relative grid grid-cols-item-section items-start w-full">
	{#if isLoading && !item}
		<Skeleton class="h-6 w-6 bg-neutral-200" />
	{:else}
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
	{/if}

	<div class="px-2 w-full space-y-2">
		{#if isLoading && !item}
			<Skeleton class="h-6 w-24 mb-1 bg-neutral-200" />
		{:else if item}
			<h3 class="text-xl font-medium mb-3">Description</h3>
		{/if}
		<div class="min-h-[60px] font-medium rounded-md item-description">
			{#if isLoading && !item}
				<div class="w-full">
					<Skeleton class="w-full h-[78px] bg-neutral-200" />
				</div>
			{:else if item}
				{#if isEditing}
					<ItemDescriptionEditor
						id={item.id}
						boardId={item.boardId}
						content={item.content}
						on:close={() => (isEditing = false)}
					/>
				{:else}
					<ItemDescriptionContent content={item.content} on:edit={() => (isEditing = true)} />

					{#if item.content !== null && item.content.trim() !== ''}
						<button
							class="absolute top-0 right-0 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
							on:click={() => (isEditing = true)}
						>
							Edit
						</button>
					{/if}
				{/if}
			{/if}
		</div>
	</div>
</section>
