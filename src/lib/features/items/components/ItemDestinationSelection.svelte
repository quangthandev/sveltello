<script lang="ts">
	import { page } from '$app/stores';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import { useBoards } from '$lib/features/boards/query-client/use-boards-query';
	import type { BoardWithColumns, ColumnWithItems, ItemWithColumn } from '$lib/types';
	import { createEventDispatcher } from 'svelte';

	export let item: ItemWithColumn;
	export let initialPosIndex: number;
	const { boardId, columnId } = item;

	const query = useBoards($page.data.boards);

	// Initialize selected values
	let selectedBoardId = boardId;
	let selectedColumnId = columnId;
	let selectedPosIndex = initialPosIndex;

	let boards: BoardWithColumns[] = [];
	let board: BoardWithColumns | undefined;
	let columns: ColumnWithItems[] = [];
	let column: ColumnWithItems | undefined;

	$: {
		boards = $query.data;
		board = boards.find((board) => board.id === selectedBoardId);
	}

	$: {
		columns = board?.columns ?? [];
		column = columns.find((column) => column.id === selectedColumnId);
	}

	$: {
		if (selectedColumnId === columnId) {
			selectedPosIndex = initialPosIndex;
		} else {
			selectedPosIndex = 1;
		}
	}

	const dispatch = createEventDispatcher();

	$: {
		dispatch('validate', {
			isValid: !$query.isFetching && !$query.isLoading && !!column
		});
	}
</script>

{#if $query.isLoading}
	<Skeleton class="h-16 rounded-md bg-gray-200" />
{:else}
	<div class="relative min-h-[48px] px-4 py-2 rounded-md bg-gray-200">
		<div>Board</div>
		<div>{board?.name}</div>
		<label for="boardId" class="hidden"> Board </label>
		<select
			name="boardId"
			id="boardId"
			class="appearance-none bg-transparent w-full absolute inset-0 opacity-0 cursor-pointer"
			bind:value={selectedBoardId}
			on:change={() => {
				if (selectedBoardId === boardId) {
					selectedColumnId = columnId;
				} else {
					selectedColumnId = columns[0]?.id ?? '';
				}
			}}
		>
			{#each boards as board}
				<option value={board.id}>{board.name} {board.id === boardId ? '(current)' : ''}</option>
			{/each}
		</select>
	</div>
{/if}
{#if $query.isLoading}
	<Skeleton class="h-16 rounded-md bg-gray-200" />
{:else}
	<div class="flex justify-between gap-2">
		<div class="relative flex-grow min-h-[48px] px-4 py-2 rounded-md bg-gray-200">
			<div>List</div>
			<div>{column?.name || 'No Lists'}</div>
			{#if column}
				<label for="columnId" class="hidden"> List </label>
				<select
					name="columnId"
					id="columnId"
					class="appearance-none bg-transparent w-full absolute inset-0 opacity-0 cursor-pointer"
					bind:value={selectedColumnId}
				>
					{#each columns as column}
						<option value={column.id}
							>{column.name} {column.id === columnId ? '(current)' : ''}</option
						>
					{/each}
				</select>
			{/if}
		</div>
		<div class="relative min-h-[48px] px-4 py-2 rounded-md bg-gray-200">
			<div>Position</div>
			<div>{column ? selectedPosIndex : 'N/A'}</div>
			{#if column}
				<label for="posIndex" class="hidden"> Position </label>
				<select
					name="posIndex"
					id="posIndex"
					class="appearance-none bg-transparent w-full absolute inset-0 opacity-0 cursor-pointer"
					bind:value={selectedPosIndex}
				>
					{#each column.items?.length ? column.items : [1] as _, index}
						<option value={index + 1}>{index + 1}</option>
					{/each}
				</select>
			{/if}
		</div>
	</div>
{/if}
