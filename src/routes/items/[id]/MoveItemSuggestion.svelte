<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import IconArrowLeft from '$lib/components/icons/IconArrowLeft.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import type { Column } from '@prisma/client';
	import type { BoardWithColumns, ItemWithColumn } from '../../types';

	export let item: ItemWithColumn;

	const queryClient = useQueryClient();

	const board = queryClient.getQueryData<BoardWithColumns>(['boards', item.boardId.toString()]);
	const columns = board?.columns ?? [];

	let suggestedColumn: Column | undefined;
	let isMoving = false;

	if (columns.length > 1) {
		const columnIndex = columns.findIndex((column) => column.id === item.columnId) ?? -1;

		if (columnIndex > -1) {
			const nextColumn = columns[columnIndex + 1];
			if (nextColumn) {
				suggestedColumn = nextColumn;
			} else {
				suggestedColumn = columns[columnIndex - 1];
			}
		}
	}

	const moveItem = createMutation<unknown, unknown, string>({
		mutationFn: async (columnId) => {
			const res = await fetch(`/items/${item.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ columnId: columnId })
			});
			return res.json();
		},
		onMutate: () => {
			isMoving = true;
		},
		onSettled: () => {
			isMoving = false;
			queryClient.invalidateQueries({
				queryKey: ['boards', item.boardId.toString()]
			});
		}
	});

	function handleMove() {
		if (suggestedColumn) {
			$moveItem.mutate(suggestedColumn.id);
		}
	}
</script>

{#if suggestedColumn}
	<section class="flex flex-col gap-2 px-4 py-2">
		<h4>Suggested</h4>
		<button
			on:click={handleMove}
			disabled={isMoving}
			class="flex items-center gap-2 w-full min-h-[40px] p-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
		>
			{#if item.column.order < suggestedColumn.order}
				<IconArrowRight />
			{:else}
				<IconArrowLeft />
			{/if}
			{suggestedColumn.name}
		</button>
	</section>
{/if}
