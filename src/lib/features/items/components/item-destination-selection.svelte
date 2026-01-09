<script lang="ts">
	import { page } from '$app/state';
	import Skeleton from '$lib/components/ui/skeleton.svelte';
	import { useBoards } from '$lib/features/boards/query-client/queries';
	import type { ItemFullPayload } from '$lib/types';

	interface Props {
		item: ItemFullPayload;
		initialPosIndex: number;
		onValidate: (isValid: boolean) => void;
	}

	let { item, initialPosIndex, onValidate }: Props = $props();

	const { boardId, columnId } = $derived(item);

	const query = useBoards(page.data.boards);

	// Initialize selected values
	let selectedBoardId = $state(boardId);
	let selectedColumnId = $state(columnId);

	const boards = $derived($query.data);
	const board = $derived(boards.find((board) => board.id === selectedBoardId));
	const columns = $derived(board?.columns ?? []);
	const column = $derived(columns.find((column) => column.id === selectedColumnId));

	let selectedPosIndex = $derived.by(() => {
		if (selectedColumnId !== columnId) {
			return 1;
		}

		return initialPosIndex;
	});

	const isValid = $derived(!$query.isFetching && !$query.isLoading && !!column);

	$effect(() => onValidate(isValid));
</script>

{#if $query.isLoading}
	<Skeleton class="h-16 rounded-md bg-gray-200" />
{:else}
	<div class="relative min-h-[48px] px-4 py-2 rounded-md bg-secondary">
		<div>Board</div>
		<div>{board?.name}</div>
		<label for="boardId" class="hidden"> Board </label>
		<select
			name="boardId"
			id="boardId"
			class="appearance-none bg-transparent w-full absolute inset-0 opacity-0 cursor-pointer"
			bind:value={selectedBoardId}
			onchange={() => {
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
	<Skeleton class="h-16 rounded-md bg-secondary" />
{:else}
	<div class="flex justify-between gap-2">
		<div class="relative flex-grow min-h-[48px] px-4 py-2 rounded-md bg-secondary">
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
						<option value={column.id}>
							{column.name}
							{column.id === columnId ? '(current)' : ''}
						</option>
					{/each}
				</select>
			{/if}
		</div>
		<div class="relative min-h-[48px] px-4 py-2 rounded-md bg-secondary">
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
