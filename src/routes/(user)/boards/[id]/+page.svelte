<script lang="ts">
	import { dndzone, type DndEvent, TRIGGERS } from 'svelte-dnd-action';
	import type { PageData } from './$types';
	import List from '$lib/features/columns/components/list.svelte';
	import EditableText from '$lib/components/shared/editable-text.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import type { Board, Column, Item } from '$lib/types';
	import NewList from '$lib/features/columns/components/new-list.svelte';
	import { useBoard } from '$lib/features/boards/query-client/queries';
	import { useUpdateColumnOrder } from '$lib/features/columns/query-client/mutations';
	import Button from '$lib/components/ui/button/button.svelte';

	export let data: PageData;

	const queryClient = useQueryClient();

	$: query = useBoard(Number($page.params.id), data?.board);

	$: board = $query.data;
	$: columns = $query.data?.columns ?? [];

	let sourceIndex: number | null = null;

	const updateColumn = useUpdateColumnOrder(Number($page.params.id));

	function handleDndConsider(e: CustomEvent<DndEvent<Column & { items: Item[] }>>) {
		// Store source index when user starts dragging for later use
		if (e.detail.info.trigger === TRIGGERS.DRAG_STARTED) {
			sourceIndex = columns.findIndex((column) => column.id === e.detail.info.id);
		}

		const prevBoardData = queryClient.getQueryData<Board & { items: Item[]; columns: Column[] }>([
			'boards',
			Number($page.params.id)
		]);
		if (prevBoardData) {
			queryClient.setQueryData(['boards', Number($page.params.id)], {
				...prevBoardData,
				columns: e.detail.items
			});
		}
	}

	function handleDndFinalize(e: CustomEvent<DndEvent<Column & { items: Item[] }>>) {
		const prevBoardData = queryClient.getQueryData<Board & { items: Item[]; columns: Column[] }>([
			'boards',
			Number($page.params.id)
		]);

		if (!prevBoardData) return;

		const newItems = e.detail.items;

		// Update the items in the query cache
		queryClient.setQueryData(['boards', Number($page.params.id)], {
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

{#if board}
	<div
		class={cn(
			'h-full flex flex-col overflow-x-auto select-none',
			'bg-no-repeat bg-center bg-cover bg-fixed'
		)}
		style:background-color={board.color}
		style:background-image={board.imageFullUrl ? `url(${board.imageFullUrl})` : 'none'}
	>
		<h1>
			<EditableText
				action="?/updateBoardName"
				value={board.name}
				fieldName="name"
				class="mx-8 my-4 w-fit"
				inputClassName="text-2xl font-bold"
				buttonClassName={cn(
					'text-2xl font-bold text-left border border-transparent',
					board.color && board.color.toLowerCase() === '#ffffff'
						? 'text-black bg-neutral-300'
						: 'text-white bg-black/50'
				)}
				on:submitting={(event) => {
					queryClient.setQueryData(['boards', Number($page.params.id)], {
						...board,
						name: event.detail
					});
				}}
				on:submitted={() => {
					queryClient.invalidateQueries({
						queryKey: ['boards', Number($page.params.id)]
					});
					queryClient.invalidateQueries({
						queryKey: ['boards']
					});
				}}
			>
				<input type="hidden" name="id" value={board.id} />
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
					<List {column} boardName={board.name} boardId={board.id} />
				{/each}
			</div>

			<NewList boardId={board.id} />
		</div>
	</div>
{:else}
	<p class="text-center mb-4">Something went wrong</p>
	<Button variant="secondary" on:click={() => $query.refetch()}>Reload</Button>
{/if}
