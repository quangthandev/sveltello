<script lang="ts">
	import { capitalize } from '$lib/utils';
	import MoveItemSuggestion from './move-item-suggestion.svelte';
	import MoveItemForm from './move-item-form.svelte';
	import type { BoardWithColumns, ItemWithColumn } from '$lib/types';
	import { useQueryClient } from '@tanstack/svelte-query';
	import CopyItemForm from './copy-item-form.svelte';
	import CardPopover from '$lib/components/shared/card-popover.svelte';

	type ActionType = 'move' | 'copy';
	export let action: ActionType = 'move';
	export let item: ItemWithColumn;

	const queryClient = useQueryClient();

	const board = queryClient.getQueryData<BoardWithColumns>(['boards', item.boardId]);
	const column = board?.columns.find((column) => column.id === item.columnId);

	let initialPosIndex = 0;
	$: {
		if (column) {
			initialPosIndex = column.items.findIndex((i) => i.id === item.id) + 1;
		}
	}
</script>

<CardPopover title={`${capitalize(action)} card`} let:trigger class="w-96 z-50">
	<slot {trigger} />
	<div slot="content">
		{#if action === 'move'}
			<section class="flex flex-col gap-2 px-4 py-2">
				<MoveItemSuggestion {item} />
			</section>
			<section class="flex flex-col gap-2 px-4 py-2">
				<h4>Select destination</h4>

				<MoveItemForm {item} {initialPosIndex} on:close={close} />
			</section>
		{:else}
			<section class="flex flex-col gap-2 px-4 py-2">
				<CopyItemForm {item} {initialPosIndex} />
			</section>
		{/if}
	</div>
</CardPopover>
