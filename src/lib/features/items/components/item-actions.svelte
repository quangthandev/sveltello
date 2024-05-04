<script lang="ts">
	import { goto } from '$app/navigation';
	import IconArrowRight from '$lib/components/icons/icon-arrow-right.svelte';
	import IconDelete from '$lib/components/icons/icon-delete.svelte';
	import IconCopy from '$lib/components/icons/icon-copy.svelte';
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import type { ItemFullPayload } from '$lib/types';
	import MoveOrCopyItemPopover from './move-or-copy-item-popover.svelte';
	import AttachPopover from './attach-popover.svelte';
	import { useDeleteItem } from '../query-client/mutations';
	import ItemCoverPopover from './item-cover-popover.svelte';
	import IconDockTop from '$lib/components/icons/icon-dock-top.svelte';

	export let item: ItemFullPayload;
	export { className as class };

	let className: string | undefined = '';

	const deleteItemMutation = useDeleteItem(item.boardId);
</script>

<div class="flex flex-col gap-8">
	<!-- Add to card -->
	<div class={cn('space-y-4', className)}>
		<h4>Add to card</h4>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
			<AttachPopover itemId={item.id} boardId={item.boardId} />
			<ItemCoverPopover cover={item.cover} itemId={item.id} let:triggerPopover>
				<Button
					variant="secondary"
					class="flex justify-start items-center gap-2 w-full"
					builders={[{ action: triggerPopover }]}
				>
					<IconDockTop />
					Cover
				</Button>
			</ItemCoverPopover>
		</div>
	</div>

	<!-- Actions -->
	<div class={cn('space-y-4', className)}>
		<h4>Actions</h4>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
			<MoveOrCopyItemPopover {item} let:trigger={triggerPopover}>
				<Button
					variant="secondary"
					builders={[{ action: triggerPopover }]}
					class="flex justify-start items-center gap-2 w-full"
				>
					<IconArrowRight />
					Move
				</Button>
			</MoveOrCopyItemPopover>
			<MoveOrCopyItemPopover {item} action="copy" let:trigger={triggerPopover}>
				<Button
					variant="secondary"
					builders={[{ action: triggerPopover }]}
					class="flex justify-start items-center gap-2 w-full"
				>
					<IconCopy />
					Copy
				</Button>
			</MoveOrCopyItemPopover>
			<CardPopover title="Delete Card" let:trigger={triggerPopover} class="w-80">
				<Button
					variant="secondary"
					builders={[{ action: triggerPopover }]}
					class="flex justify-start items-center gap-2 w-full"
				>
					<IconDelete />
					Delete
				</Button>
				<div slot="content" class="space-y-4">
					<p>Deleting a card is permanent.</p>
					<p>There is no undo.</p>
					<Button
						variant="destructive"
						class="w-full"
						disabled={$deleteItemMutation.isPending}
						on:click={async () => {
							await $deleteItemMutation.mutateAsync(item.id);

							goto(`/boards/${item.boardId}`);
						}}
					>
						Delete
					</Button>
				</div>
			</CardPopover>
		</div>
	</div>
</div>
