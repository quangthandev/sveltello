<script lang="ts">
	import IconClose from '$lib/components/icons/IconClose.svelte';
	import * as Popover from '$lib/components/popover';
	import { cn } from '$lib/utils';
	import MoveItemSuggestion from './MoveItemSuggestion.svelte';
	import MoveItemDestination from './MoveItemDestination.svelte';
	import type { BoardWithColumns, ItemWithColumn } from '../../types';
	import { useQueryClient } from '@tanstack/svelte-query';

	export let item: ItemWithColumn;

	const queryClient = useQueryClient();

	const board = queryClient.getQueryData<BoardWithColumns>(['boards', item.boardId.toString()]);
	const column = board?.columns.find((column) => column.id === item.columnId);

	let initialPosIndex = 0;
	$: {
		if (column) {
			initialPosIndex = column.items.findIndex((i) => i.id === item.id) + 1;
		}
	}
</script>

<Popover.Root let:close>
	<Popover.Trigger class="underline hover:text-blue-600">
		{item.column.name}
	</Popover.Trigger>
	<Popover.Content
		class={cn(
			'absolute top-0 left-0 bg-white shadow-2xl py-4 rounded-lg w-80 z-50 border-2 border-gray-200'
		)}
	>
		<header class="relative mb-4">
			<h3 class="font-bold text-center">Move card</h3>
			<Popover.Close
				class="absolute -top-2 right-2 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
				aria-label="close"
			>
				<IconClose />
			</Popover.Close>
		</header>
		<MoveItemSuggestion {item} />
		<MoveItemDestination {item} {initialPosIndex} on:close={close} />
	</Popover.Content>
</Popover.Root>
