<script lang="ts">
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import { useBoard } from '$lib/features/boards/query-client/queries';
	import MoveItemSuggestion from './move-item-suggestion.svelte';
	import MoveItemForm from './move-item-form.svelte';
	import CopyItemForm from './copy-item-form.svelte';
	import { getItemDetailsContext } from '../contexts/item-details.context';
	import { run } from 'svelte/legacy';
	import type { ComponentProps } from 'svelte';
	import PopoverNative from '$lib/components/ui/popover-native.svelte';

	interface Props {
		action?: 'move' | 'copy';
		children: ComponentProps<typeof PopoverNative>['children'];
	}

	let { action = 'move', children: renderChildren }: Props = $props();

	const itemDetails = getItemDetailsContext();

	const boardQuery = useBoard($itemDetails.boardId);
	let column = $derived(
		($boardQuery.data?.columns ?? []).find((column) => column.id === $itemDetails.columnId)
	);

	let initialPosIndex = $state(0);

	run(() => {
		if (column) {
			initialPosIndex = column.items.findIndex((i) => i.id === $itemDetails.id) + 1;
		}
	});

	function handleMovedOrCopied() {
		const dialog = document.getElementById(
			`${$itemDetails.id}_${action}`
		) as HTMLDialogElement | null;
		if (!dialog) return;

		dialog.requestClose();
	}
</script>

<CardPopover
	title={`${action} card`}
	targetId={`${$itemDetails.id}_${action}`}
	class="capitalize w-96 z-50"
>
	{#snippet children({ targetId, action })}
		{@render renderChildren?.({ targetId, action })}
	{/snippet}
	{#snippet content()}
		<div>
			{#if action === 'move'}
				<section class="flex flex-col gap-2 px-4 py-2">
					<MoveItemSuggestion />
				</section>
				<section class="flex flex-col gap-2 px-4 py-2">
					<MoveItemForm {initialPosIndex} onSubmitted={handleMovedOrCopied} />
				</section>
			{:else}
				<section class="flex flex-col gap-2 px-4 py-2">
					<CopyItemForm {initialPosIndex} onSubmitted={handleMovedOrCopied} />
				</section>
			{/if}
		</div>
	{/snippet}
</CardPopover>
