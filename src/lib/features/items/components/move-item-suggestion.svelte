<script lang="ts">
	import { useQueryClient } from '@tanstack/svelte-query';
	import IconArrowLeft from '$lib/components/icons/icon-arrow-left.svelte';
	import IconArrowRight from '$lib/components/icons/icon-arrow-right.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Column } from '$lib/types';
	import type { BoardWithColumns } from '$lib/types';
	import { useMoveItem } from '../query-client/mutations';
	import type { ItemFullPayload } from '$lib/types';

	interface Props {
		item: ItemFullPayload;
	}

	let { item }: Props = $props();
	const { id, boardId, column, columnId } = $derived(item);

	const queryClient = useQueryClient();

	const board = $derived(queryClient.getQueryData<BoardWithColumns>(['boards', boardId]));
	const columns = $derived(board?.columns ?? []);

	let isMoving = $state(false);

	const suggestedColumn: Column | undefined = $derived.by(() => {
		if (columns.length > 1) {
			const columnIndex = columns.findIndex((column) => column.id === columnId) ?? -1;

			if (columnIndex > -1) {
				const nextColumn = columns[columnIndex + 1];
				if (nextColumn) {
					return nextColumn;
				} else {
					return columns[columnIndex - 1];
				}
			}
		}
	});

	const moveItemMutation = $derived(
		useMoveItem({
			id,
			boardId: boardId,
			onMutate: () => {
				isMoving = true;
			},
			onSettled: () => {
				isMoving = false;
			}
		})
	);

	function handleMove() {
		if (suggestedColumn) {
			moveItemMutation.mutate(suggestedColumn.id);
		}
	}
</script>

{#if suggestedColumn}
	<h4>Suggested</h4>
	<Button
		variant="secondary"
		onclick={handleMove}
		disabled={isMoving}
		class="flex justify-start items-center gap-2 w-full min-h-[40px]"
	>
		{#if column.order < suggestedColumn.order}
			<IconArrowRight />
		{:else}
			<IconArrowLeft />
		{/if}
		{suggestedColumn.name}
	</Button>
{/if}
