<script lang="ts">
	import type { Item } from '@prisma/client';
	import EditableText from './EditableText.svelte';
	import Card from './Card.svelte';
	import NewCard from './NewCard.svelte';
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { queriesCtx } from './context';
	import { page } from '$app/stores';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { Board, Column } from '@prisma/client';
	export let name: string;
	export let columnId: string;
	export let items: Item[];

	let editing: boolean = false;
	let listEl: HTMLOListElement;

	let sourceIndex: number | null = null;

	function scrollList() {
		if (listEl) {
			listEl.scrollTop = listEl.scrollHeight;
		}
	}

	const { updateItem } = queriesCtx.get();

	const queryClient = useQueryClient();

	function handleDndConsider(columnId: string, e: CustomEvent<DndEvent<Item>>) {
		// Store source index when user starts dragging for later use
		if (e.detail.info.trigger === 'dragStarted') {
			sourceIndex = items.findIndex((item) => item.id === e.detail.info.id);
		}

		const prevBoardData = queryClient.getQueryData<
			Board & { items: Item[]; columns: (Column & { items: Item[] })[] }
		>(['boards', $page.params.id]);

		if (prevBoardData) {
			queryClient.setQueryData(['boards', $page.params.id], {
				...prevBoardData,
				columns: prevBoardData.columns.map((c) =>
					c.id === columnId ? { ...c, items: e.detail.items } : c
				)
			});
		}
	}

	function handleDndFinalize(columnId: string, e: CustomEvent<DndEvent<Item>>) {
		const prevBoardData = queryClient.getQueryData<
			Board & { items: Item[]; columns: (Column & { items: Item[] })[] }
		>(['boards', $page.params.id]);

		if (!prevBoardData) return;

		const newItems = e.detail.items;

		// Update the items in the query cache
		queryClient.setQueryData(['boards', $page.params.id], {
			...prevBoardData,
			columns: prevBoardData.columns.map((c) => (c.id === columnId ? { ...c, items: newItems } : c))
		});

		if (e.detail.info.trigger === 'droppedIntoZone') {
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
			const item = prevBoardData.items.find((i) => i.id === droppedItemId);
			if (item) {
				$updateItem.mutate({ ...item, order: newOrder, columnId });
			}

			// Reset the source index
			sourceIndex = null;
		}
	}
</script>

<lio
	class="flex-shrink-0 flex flex-col overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-slate-100"
>
	<div class="p-2">
		<EditableText
			action="?/updateColumnName"
			fieldName="name"
			value={name}
			inputClassName="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
			buttonClassName="block rounded-lg text-left w-full border border-transparent py-1 px-2 font-medium text-slate-600"
		>
			<input type="hidden" name="columnId" value={columnId} />
		</EditableText>
	</div>

	<ol
		bind:this={listEl}
		class="flex-grow overflow-auto min-h-4"
		use:dndzone={{
			items: items,
			flipDurationMs: 300,
			type: 'items'
		}}
		on:consider={(e) => handleDndConsider(columnId, e)}
		on:finalize={(e) => handleDndFinalize(columnId, e)}
	>
		{#each items as item (item.id)}
			<li animate:flip={{ duration: 250 }}>
				<Card title={item.title} content={item.content} id={item.id} />
			</li>
		{/each}
	</ol>

	{#if editing}
		<NewCard
			{columnId}
			nextOrder={items.length === 0 ? 1 : items[items.length - 1].order + 1}
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
				class="flex items-center gap-2 rounded-lg text-left w-full p-2 font-medium text-slate-500 hover:bg-slate-200 focus:bg-slate-200"
			>
				<svg
					width="24"
					height="24"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<title>add</title>
					<path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
				</svg>
				Add a card
			</button>
		</div>
	{/if}
</lio>
