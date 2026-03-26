<script lang="ts">
	import { dndzone, type DndEvent, TRIGGERS } from 'svelte-dnd-action';
	import { useUpdateItem } from '$lib/features/item/query-client/item.mutations';
	import type { ItemWithCoverAndAttachments } from '$lib/types';
	import ListItem from './list-item.svelte';
	import { cn } from '$lib/utils';

	interface Props {
		id: string;
		boardName: string;
		boardId: number;
		items: ItemWithCoverAndAttachments[];
	}

	let { id, boardName, boardId, items }: Props = $props();

	let sourceIndex = $state<number | null>(null);

	const updateItemMutation = $derived(useUpdateItem(boardId));

	function handleDndConsider(cId: string, e: CustomEvent<DndEvent<ItemWithCoverAndAttachments>>) {
		if (id === cId) {
			// Store source index when user starts dragging for later use
			if (e.detail.info.trigger === TRIGGERS.DRAG_STARTED) {
				sourceIndex = items.findIndex((item) => item.id === e.detail.info.id);
			}

			items = e.detail.items;
		}
	}

	function handleDndFinalize(cId: string, e: CustomEvent<DndEvent<ItemWithCoverAndAttachments>>) {
		if (id === cId) {
			const { items: newItems } = e.detail;

			items = newItems;

			if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
				// Get the index of the item that was dropped
				const droppedItemId = e.detail.info.id;
				const droppedIndex = newItems.findIndex((i) => i.id === droppedItemId);

				// If the item was dropped in the same position and same column, do nothing
				if (sourceIndex === droppedIndex && id === newItems[droppedIndex].id) return;

				// Calculate the new order for the dropped item
				const previousOrder = newItems[droppedIndex - 1] ? newItems[droppedIndex - 1].order : 0;
				const nextOrder = newItems[droppedIndex + 1]
					? newItems[droppedIndex + 1].order
					: previousOrder + 1;
				const newOrder = (previousOrder + nextOrder) / 2;

				// Update the item
				const item = items.find((item) => item.id === droppedItemId);
				if (item) {
					updateItemMutation.mutate({ ...item, order: newOrder, columnId: cId });
				}

				// Reset the source index
				sourceIndex = null;
			}
		}
	}

	function transformDraggedElement(draggedEl?: HTMLElement) {
		if (!draggedEl) return;

		const listItem = draggedEl.querySelector('.list-item');

		if (listItem) {
			(listItem as HTMLElement).style.transform = 'rotate(8deg)';
		}
	}
</script>

<ol
	class={cn('flex-grow overflow-auto', {
		'min-h-8': items.length === 0
	})}
	use:dndzone={{
		items: items,
		flipDurationMs: 300,
		type: 'items',
		transformDraggedElement
	}}
	onconsider={(e) => handleDndConsider(id, e)}
	onfinalize={(e) => handleDndFinalize(id, e)}
>
	{#each items as item (item.id)}
		<li>
			<ListItem {item} {boardName} class="list-item" />
		</li>
	{/each}
</ol>
