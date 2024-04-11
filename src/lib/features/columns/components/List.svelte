<script lang="ts">
	import ListItem from './ListItem.svelte';
	import ListActionsMenu from './ListActionsMenu.svelte';
	import { tick } from 'svelte';
	import { dndzone, type DndEvent, TRIGGERS, SHADOW_PLACEHOLDER_ITEM_ID } from 'svelte-dnd-action';
	import IconPlus from '$lib/components/icons/IconPlus.svelte';
	import type { ItemWithCoverAndAttachments } from '$lib/types';
	import { queriesCtx } from '../../../../routes/items/[id]/context';
	import EditableText from '$lib/components/shared/EditableText.svelte';
	import NewItem from '$lib/features/items/components/NewItem.svelte';

	export let name: string;
	export let boardName: string;
	export let columnId: string;
	export let items: ItemWithCoverAndAttachments[];

	let localItems: ItemWithCoverAndAttachments[] = items;

	$: if (items) {
		dealWithServerUpdate();
	}
	function dealWithServerUpdate() {
		const shadowItem = localItems.find((item) => item.id === SHADOW_PLACEHOLDER_ITEM_ID);

		if (!shadowItem) {
			localItems = items;
		} else {
			localItems = items.map((sItem) =>
				localItems.find((cItem) => sItem.id === cItem.id) ? sItem : shadowItem
			);
		}
	}

	let editing: boolean = false;
	let listEl: HTMLOListElement;

	let sourceIndex: number | null = null;

	function scrollList() {
		if (listEl) {
			listEl.scrollTop = listEl.scrollHeight;
		}
	}

	const { updateItem } = queriesCtx.get();

	function handleDndConsider(cId: string, e: CustomEvent<DndEvent<ItemWithCoverAndAttachments>>) {
		if (columnId === cId) {
			// Store source index when user starts dragging for later use
			if (e.detail.info.trigger === TRIGGERS.DRAG_STARTED) {
				sourceIndex = items.findIndex((item) => item.id === e.detail.info.id);
			}

			localItems = e.detail.items;
		}
	}

	function handleDndFinalize(cId: string, e: CustomEvent<DndEvent<ItemWithCoverAndAttachments>>) {
		if (columnId === cId) {
			const { items: newItems } = e.detail;

			localItems = newItems;

			if (e.detail.info.trigger === TRIGGERS.DROPPED_INTO_ZONE) {
				// Get the index of the item that was dropped
				const droppedItemId = e.detail.info.id;
				const droppedIndex = newItems.findIndex((i) => i.id === droppedItemId);

				// If the item was dropped in the same position and same column, do nothing
				if (sourceIndex === droppedIndex && columnId === newItems[droppedIndex].columnId) return;

				// Calculate the new order for the dropped item
				const previousOrder = newItems[droppedIndex - 1] ? newItems[droppedIndex - 1].order : 0;
				const nextOrder = newItems[droppedIndex + 1]
					? newItems[droppedIndex + 1].order
					: previousOrder + 1;
				const newOrder = (previousOrder + nextOrder) / 2;

				// Update the item
				const item = localItems.find((item) => item.id === droppedItemId);
				if (item) {
					$updateItem.mutate({ ...item, order: newOrder, columnId });
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

<li
	class="flex-shrink-0 flex flex-col gap-1 overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-slate-100"
>
	<div class="p-2 flex justify-between items-center">
		<EditableText
			action="?/updateColumnName"
			fieldName="name"
			value={name}
			inputClassName="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
			buttonClassName="block rounded-lg text-left w-full border border-transparent py-1 px-2 font-medium text-slate-600"
		>
			<input type="hidden" name="columnId" value={columnId} />
		</EditableText>
		<ListActionsMenu id={columnId} {name} onAddCard={() => (editing = true)} />
	</div>

	<ol
		bind:this={listEl}
		class="flex-grow overflow-auto min-h-4"
		use:dndzone={{
			items: localItems,
			flipDurationMs: 300,
			type: 'items',
			transformDraggedElement
		}}
		on:consider={(e) => handleDndConsider(columnId, e)}
		on:finalize={(e) => handleDndFinalize(columnId, e)}
	>
		{#each localItems as item (item.id)}
			<li>
				<ListItem {item} {boardName} class="list-item" />
			</li>
		{/each}
	</ol>

	{#if editing}
		<NewItem
			{columnId}
			nextOrder={localItems.length === 0 ? 1 : localItems[localItems.length - 1].order + 1}
			on:create={async () => {
				await tick();
				scrollList();
			}}
			on:complete={() => (editing = false)}
		/>
	{:else}
		<div class="p-2">
			<button
				type="button"
				on:click={async () => {
					editing = true;
					await tick();
					scrollList();
				}}
				aria-label="Add a card"
				class="flex items-center gap-2 rounded-lg text-left w-full p-2 font-medium text-slate-500 hover:bg-slate-200 focus:bg-slate-200"
			>
				<IconPlus />
				Add a card
			</button>
		</div>
	{/if}
</li>
