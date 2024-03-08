<script lang="ts">
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import { page } from '$app/stores';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import type { BoardWithColumns, ColumnWithItems, ItemWithColumn } from '../../types';

	export let item: ItemWithColumn;
	export let initialPosIndex: number;
	const { boardId, columnId } = item;

	const queryClient = useQueryClient();

	const query = createQuery<{ boards: BoardWithColumns[] }>({
		queryKey: ['boards'],
		queryFn: async () => (await fetch('/boards')).json(),
		initialData: $page.data.boards
	});

	// Initialize selected values
	let selectedBoardId = boardId;
	let selectedColumnId = columnId;
	let selectedPosIndex = initialPosIndex;

	// Submit state
	let isSubmitting = false;

	let boards: BoardWithColumns[] = [];
	let board: BoardWithColumns | undefined;
	let columns: ColumnWithItems[] = [];
	let column: ColumnWithItems | undefined;

	$: {
		boards = $query.data?.boards ?? [];
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
</script>

<section class="flex flex-col gap-2 px-4 py-2">
	<h4>Select destination</h4>
	<form
		class="space-y-2"
		method="post"
		action="?/moveItemToDestination"
		use:enhance={() => {
			isSubmitting = true;

			return async ({ update }) => {
				await update({ invalidateAll: false });

				queryClient.invalidateQueries({
					queryKey: ['boards', boardId.toString()]
				});
				queryClient.invalidateQueries({
					queryKey: ['items', item.id]
				});

				isSubmitting = false;
				dispatch('close');
				goto(`/boards/${boardId}`);
			};
		}}
	>
		<input type="title" hidden name="title" value={item.title} />
		{#if $query.isFetching}
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
		{#if $query.isFetching}
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
		<button
			class="w-full bg-blue-600 hover:opacity-90 text-white rounded-lg py-2 px-4 font-medium disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed"
			disabled={$query.isFetching || $query.isLoading || !column || isSubmitting}
		>
			Move
		</button>
	</form>
</section>
