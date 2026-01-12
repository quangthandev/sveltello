<script lang="ts">
	import { goto } from '$app/navigation';
	import IconArrowRight from '$lib/components/icons/icon-arrow-right.svelte';
	import IconDelete from '$lib/components/icons/icon-delete.svelte';
	import IconCopy from '$lib/components/icons/icon-copy.svelte';
	import IconDockTop from '$lib/components/icons/icon-dock-top.svelte';
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import MoveOrCopyItemPopover from './move-or-copy-item-popover.svelte';
	import AttachPopover from './attach-popover.svelte';
	import { useDeleteItem } from '../query-client/mutations';
	import ItemCoverPopover from './item-cover-popover.svelte';
	import type { ItemFullPayload } from '$lib/types';

	interface Props {
		item: ItemFullPayload;
		class?: string | undefined;
	}

	let { item, class: className = '' }: Props = $props();
	const { id, boardId, cover, attachments } = $derived(item);

	const deleteItemMutation = $derived(useDeleteItem(boardId));
</script>

<div class="flex flex-col gap-8">
	<!-- Add to card -->
	<div class={cn('space-y-4', className)}>
		<h4>Add to card</h4>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
			<AttachPopover itemId={id} {boardId} />
			{#if !cover}
				<ItemCoverPopover
					{cover}
					attachments={attachments.filter((attachment) => attachment.type.startsWith('image/'))}
					itemId={id}
				>
					{#snippet children({ targetId })}
						<Button
							variant="secondary"
							class="flex justify-start items-center gap-2 w-full"
							popovertarget={targetId}
						>
							<IconDockTop />
							Cover
						</Button>
					{/snippet}
				</ItemCoverPopover>
			{/if}
		</div>
	</div>

	<!-- Actions -->
	<div class={cn('space-y-4', className)}>
		<h4>Actions</h4>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
			<MoveOrCopyItemPopover {item}>
				{#snippet children({ targetId })}
					<Button
						variant="secondary"
						popovertarget={targetId}
						class="flex justify-start items-center gap-2 w-full"
					>
						<IconArrowRight />
						Move
					</Button>
				{/snippet}
			</MoveOrCopyItemPopover>
			<MoveOrCopyItemPopover {item} action="copy">
				{#snippet children({ targetId })}
					<Button
						variant="secondary"
						popovertarget={targetId}
						class="flex justify-start items-center gap-2 w-full"
					>
						<IconCopy />
						Copy
					</Button>
				{/snippet}
			</MoveOrCopyItemPopover>
			<CardPopover title="Delete Card" targetId={`delete_${id}`} class="w-80">
				{#snippet children({ targetId })}
					<Button
						variant="secondary"
						popovertarget={targetId}
						class="flex justify-start items-center gap-2 w-full"
					>
						<IconDelete />
						Delete
					</Button>
				{/snippet}
				{#snippet content()}
					<div class="space-y-4">
						<p>Deleting a card is permanent.</p>
						<p>There is no undo.</p>
						<Button
							variant="destructive"
							class="w-full"
							disabled={$deleteItemMutation.isPending}
							onclick={async () => {
								await $deleteItemMutation.mutateAsync(id);

								goto(`/boards/${boardId}`);
							}}
						>
							Delete
						</Button>
					</div>
				{/snippet}
			</CardPopover>
		</div>
	</div>
</div>
