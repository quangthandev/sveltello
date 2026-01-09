<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import ItemDescriptionEditor from './item-description-editor.svelte';
	import ItemDescriptionContent from './item-description-content.svelte';
	import type { ItemFullPayload } from '$lib/types';

	interface Props {
		item: ItemFullPayload;
	}

	let { item }: Props = $props();
	const { id, boardId, content } = $derived(item);

	let isEditing = $state(false);
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

	<div class="px-2 w-full space-y-2">
		<h3 class="text-xl font-medium mb-3">Description</h3>
		<div class="min-h-[60px] font-medium rounded-md item-description py-2">
			{#if isEditing}
				<ItemDescriptionEditor {id} {boardId} {content} onClose={() => (isEditing = false)} />
			{:else}
				<ItemDescriptionContent {content} onEdit={() => (isEditing = true)} />

				{#if content?.trim() !== ''}
					<Button
						variant="secondary"
						class="absolute top-0 right-2"
						onclick={() => (isEditing = true)}
					>
						Edit
					</Button>
				{/if}
			{/if}
		</div>
	</div>
</section>
