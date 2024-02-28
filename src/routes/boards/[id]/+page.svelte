<script lang="ts">
	import { dndzone, type DndEvent, TRIGGERS } from 'svelte-dnd-action';
	import type { Board, Item, Column } from '@prisma/client';
	import type { PageData } from './$types';
	import List from './List.svelte';
	import EditableText from './EditableText.svelte';
	import NewList from './NewList.svelte';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { page } from '$app/stores';
	import BoardQueriesProvider from './BoardQueriesProvider.svelte';

	export let data: PageData;

	const queryClient = useQueryClient();

	const query = createQuery<Board & { items: Item[]; columns: (Column & { items: Item[] })[] }>({
		queryKey: ['boards', $page.params.id],
		queryFn: async () => (await fetch(`/boards/${$page.params.id}`)).json(),
		initialData: data.board
	});

	$: columns = $query.data.columns;

	let sourceIndex: number | null = null;

	// Column mutation
	type MutationData = {
		id: string;
		order: number;
	};

	const updateColumn = createMutation<unknown, unknown, MutationData>({
		mutationFn: async (data) => {
			const res = await fetch(`/columns/${data.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ order: data.order })
			});
			return res.json();
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['boards', $page.params.id] });
		}
	});

	function handleDndConsider(e: CustomEvent<DndEvent<Column & { items: Item[] }>>) {
		// Store source index when user starts dragging for later use
		if (e.detail.info.trigger === TRIGGERS.DRAG_STARTED) {
			sourceIndex = columns.findIndex((column) => column.id === e.detail.info.id);
		}

		const prevBoardData = queryClient.getQueryData<Board & { items: Item[]; columns: Column[] }>([
			'boards',
			$page.params.id
		]);
		if (prevBoardData) {
			queryClient.setQueryData(['boards', $page.params.id], {
				...prevBoardData,
				columns: e.detail.items
			});
		}
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<Column & { items: Item[] }>>) {
		const prevBoardData = queryClient.getQueryData<Board & { items: Item[]; columns: Column[] }>([
			'boards',
			$page.params.id
		]);

		if (!prevBoardData) return;

		const newItems = e.detail.items;

		// Update the items in the query cache
		queryClient.setQueryData(['boards', $page.params.id], {
			...prevBoardData,
			columns: newItems
		});

		// Get index of dropped item
		const droppedColumnId = e.detail.info.id;
		const droppedIndex = newItems.findIndex((column) => column.id === droppedColumnId);

		// If the item was dropped in the same position and same column, do nothing
		if (sourceIndex === droppedIndex) return;

		// Get prevOrder and nextOrder of dropped item
		const prevOrder = newItems[droppedIndex - 1] ? newItems[droppedIndex - 1].order : 0;
		const nextOrder = newItems[droppedIndex + 1] ? newItems[droppedIndex + 1].order : prevOrder + 1;
		const newOrder = (prevOrder + nextOrder) / 2;

		// Update the order of the dropped item
		$updateColumn.mutate({ id: droppedColumnId, order: newOrder });

		// Reset source index
		sourceIndex = null;
	}
</script>

<svelte:head>
	<title>{data.board.name}</title>
</svelte:head>

<BoardQueriesProvider>
	<div
		class="h-full min-h-0 flex flex-col overflow-x-scroll select-none"
		style:background-color={data.board.color}
	>
		<h1>
			<EditableText
				action="?/updateBoardName"
				value={data.board.name}
				fieldName="name"
				inputClassName="mx-8 my-4 text-2xl font-medium border border-slate-400 rounded-lg py-1 px-2 text-black"
				buttonClassName="mx-8 my-4 text-2xl font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
			>
				<input type="hidden" name="id" value={data.board.id} />
			</EditableText>
		</h1>
		<div class="flex items-start gap-4 px-8 pb-4">
			<div
				use:dndzone={{
					items: columns,
					flipDurationMs: 300,
					type: 'columns'
				}}
				on:consider={handleDndConsider}
				on:finalize={handleDndFinalize}
				class="flex min-h-0 h-full items-start gap-4"
			>
				{#each columns as column (column.id)}
					<List name={column.name} columnId={column.id} items={column.items} />
				{/each}
			</div>

			<NewList boardId={data.board.id} />
		</div>
	</div>
</BoardQueriesProvider>
