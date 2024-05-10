<script lang="ts">
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import { useBoard } from '$lib/features/boards/query-client/queries';
	import MoveItemSuggestion from './move-item-suggestion.svelte';
	import MoveItemForm from './move-item-form.svelte';
	import CopyItemForm from './copy-item-form.svelte';
	import { getItemDetailsContext } from '../contexts/item-details.context';

	export let action: 'move' | 'copy' = 'move';

	const itemDetails = getItemDetailsContext();

	const boardQuery = useBoard($itemDetails.boardId);
	$: column = ($boardQuery.data?.columns ?? []).find(
		(column) => column.id === $itemDetails.columnId
	);

	let initialPosIndex = 0;
	$: {
		if (column) {
			initialPosIndex = column.items.findIndex((i) => i.id === $itemDetails.id) + 1;
		}
	}
</script>

<CardPopover title={`${action} card`} let:trigger class="capitalize w-96 z-50">
	<slot {trigger} />
	<div slot="content">
		{#if action === 'move'}
			<section class="flex flex-col gap-2 px-4 py-2">
				<MoveItemSuggestion />
			</section>
			<section class="flex flex-col gap-2 px-4 py-2">
				<h4>Select destination</h4>

				<MoveItemForm {initialPosIndex} on:close={close} />
			</section>
		{:else}
			<section class="flex flex-col gap-2 px-4 py-2">
				<CopyItemForm {initialPosIndex} />
			</section>
		{/if}
	</div>
</CardPopover>
