<script lang="ts">
	import { useQueryClient } from '@tanstack/svelte-query';
	import IconArrowLeft from '$lib/components/icons/IconArrowLeft.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import type { Column } from '$lib/types';
	import type { BoardWithColumns, ItemWithColumn } from '$lib/types';
	import { useMoveItem } from '../query-client/mutations';
	import Button from '$lib/components/ui/button/button.svelte';

	export let item: ItemWithColumn;

	const queryClient = useQueryClient();

	const board = queryClient.getQueryData<BoardWithColumns>(['boards', item.boardId]);
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

	const moveItemMutation = useMoveItem({
		id: item.id,
		boardId: item.boardId,
		onMutate: () => {
			isMoving = true;
		},
		onSettled: () => {
			isMoving = false;
		}
	});

	function handleMove() {
		if (suggestedColumn) {
			$moveItemMutation.mutate(suggestedColumn.id);
		}
	}
</script>

{#if suggestedColumn}
	<h4>Suggested</h4>
	<Button
		variant="secondary"
		on:click={handleMove}
		disabled={isMoving}
		class="flex justify-start items-center gap-2 w-full min-h-[40px]"
	>
		{#if item.column.order < suggestedColumn.order}
			<IconArrowRight />
		{:else}
			<IconArrowLeft />
		{/if}
		{suggestedColumn.name}
	</Button>
{/if}
