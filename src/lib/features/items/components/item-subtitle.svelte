<script lang="ts">
	import { useBoard } from '$lib/features/boards/query-client/queries';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ItemFullPayload } from '$lib/types';
	import MoveOrCopyItemPopover from './move-or-copy-item-popover.svelte';

	export let item: ItemFullPayload;

	const boardQuery = useBoard(item.boardId);
</script>

<p class="text-sm text-muted-foreground px-3">
	in list
	{#if $boardQuery.isFetching}
		<Button variant="ghost" class="p-0 hover:bg-transparent" disabled>{item.column.name}</Button>
	{:else}
		<MoveOrCopyItemPopover {item} let:trigger={triggerPopover}>
			<Button
				variant="link"
				builders={[{ action: triggerPopover }]}
				class="p-0 underline hover:bg-transparent"
			>
				{item.column.name}
			</Button>
		</MoveOrCopyItemPopover>
	{/if}
</p>
