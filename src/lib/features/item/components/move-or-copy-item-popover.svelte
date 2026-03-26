<script lang="ts">
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import { useBoard } from '$lib/features/board/query-client/board.queries';
	import MoveItemSuggestion from './move-item-suggestion.svelte';
	import MoveItemForm from './move-item-form.svelte';
	import CopyItemForm from './copy-item-form.svelte';
	import type { ComponentProps } from 'svelte';
	import PopoverNative from '$lib/components/ui/popover-native.svelte';
	import type { ItemFullPayload } from '$lib/types';

	interface Props {
		item: ItemFullPayload;
		action?: 'move' | 'copy';
		children: ComponentProps<typeof PopoverNative>['children'];
	}

	let { item, action = 'move', children: renderChildren }: Props = $props();
	const { id, boardId, columnId } = $derived(item);

	const boardQuery = $derived(useBoard(boardId));
	let column = $derived((boardQuery.data?.columns ?? []).find((column) => column.id === columnId));

	const initialPosIndex = $derived.by(() => {
		if (!column) {
			return 0;
		}

		return column.items.findIndex((i) => i.id === id) + 1;
	});

	function handleMovedOrCopied() {
		const dialog = document.getElementById(`${id}_${action}`) as HTMLDialogElement | null;
		if (!dialog) return;

		dialog.requestClose();
	}
</script>

<CardPopover title={`${action} card`} targetId={`${id}_${action}`} class="capitalize w-96 z-50">
	{#snippet children({ targetId, action })}
		{@render renderChildren?.({ targetId, action })}
	{/snippet}
	{#snippet content()}
		<div>
			{#if action === 'move'}
				<section class="flex flex-col gap-2 px-4 py-2">
					<MoveItemSuggestion {item} />
				</section>
				<section class="flex flex-col gap-2 px-4 py-2">
					<MoveItemForm {item} {initialPosIndex} onSubmitted={handleMovedOrCopied} />
				</section>
			{:else}
				<section class="flex flex-col gap-2 px-4 py-2">
					<CopyItemForm {item} {initialPosIndex} onSubmitted={handleMovedOrCopied} />
				</section>
			{/if}
		</div>
	{/snippet}
</CardPopover>
