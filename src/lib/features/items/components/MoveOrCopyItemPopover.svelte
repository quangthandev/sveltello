<script lang="ts">
	import IconClose from '$lib/components/icons/IconClose.svelte';
	import * as Popover from '$lib/components/popover';
	import { cn } from '$lib/utils';
	import MoveItemSuggestion from './MoveItemSuggestion.svelte';
	import MoveItemForm from './MoveItemForm.svelte';
	import type { BoardWithColumns, ItemWithColumn } from '$lib/types';
	import { useQueryClient } from '@tanstack/svelte-query';
	import CopyItemForm from './CopyItemForm.svelte';

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

<Popover.Root let:close>
	<Popover.Trigger asChild let:triggerAction={trigger}>
		<slot {trigger} />
	</Popover.Trigger>
	<Popover.Content
		class={cn(
			'absolute top-0 left-0 bg-white shadow-2xl py-4 rounded-lg w-80 z-50 border-2 border-gray-200'
		)}
	>
		<header class="relative mb-4">
			<h3 class="font-bold text-center">
				{#if action === 'move'}
					Move card
				{:else}
					Copy card
				{/if}
			</h3>
			<Popover.Close
				class="absolute -top-2 right-2 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
				aria-label="close"
			>
				<IconClose />
			</Popover.Close>
		</header>

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
	</Popover.Content>
</Popover.Root>
