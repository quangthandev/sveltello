<script lang="ts">
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import IconDelete from '$lib/components/icons/IconDelete.svelte';
	import IconCopy from '$lib/components/icons/IconCopy.svelte';
	import { cn } from '$lib/utils';
	import MoveOrCopyItemPopover from './MoveOrCopyItemPopover.svelte';
	import AttachPopover from './AttachPopover.svelte';
	import { goto } from '$app/navigation';
	import CardPopover from '$lib/components/shared/CardPopover.svelte';
	import type { ItemFullPayload } from '$lib/types';
	import { useDeleteItem } from '../query-client/mutations';
	import Button from '$lib/components/ui/button/button.svelte';

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
			<CardPopover title="Delete Card" let:trigger={triggerPopover}>
				<Button
					variant="secondary"
					builders={[{ action: triggerPopover }]}
					class="flex justify-start items-center gap-2 w-full"
				>
					<IconDelete />
					Delete
				</Button>
				<div slot="content" class="px-4 space-y-4">
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
