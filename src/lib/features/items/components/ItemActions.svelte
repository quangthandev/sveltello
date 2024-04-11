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
	import { queriesCtx } from '../../../../routes/items/[id]/context';

	export let item: ItemFullPayload;
	export { className as class };

	let className: string | undefined = '';

	const { deleteItem } = queriesCtx.get();
</script>

<div class="flex flex-col gap-8">
	<!-- Add to card -->
	<div class={cn('space-y-4', className)}>
		<h4>Add to card</h4>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
			<AttachPopover itemId={item.id} />
		</div>
	</div>

	<!-- Actions -->
	<div class={cn('space-y-4', className)}>
		<h4>Actions</h4>
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-2">
			<MoveOrCopyItemPopover {item} let:trigger>
				<button
					use:trigger
					class="flex items-center gap-2 w-full p-2 rounded-md bg-gray-200 hover:bg-gray-300"
				>
					<IconArrowRight />
					Move
				</button>
			</MoveOrCopyItemPopover>
			<MoveOrCopyItemPopover {item} action="copy" let:trigger>
				<button
					use:trigger
					class="flex items-center gap-2 w-full p-2 rounded-md bg-gray-200 hover:bg-gray-300"
				>
					<IconCopy />
					Copy
				</button>
			</MoveOrCopyItemPopover>
			<CardPopover title="Delete Card" let:trigger>
				<button
					use:trigger
					class="flex items-center gap-2 w-full p-2 rounded-md bg-gray-200 hover:bg-gray-300"
				>
					<IconDelete />
					Delete
				</button>
				<div slot="content" class="px-4 space-y-4">
					<p>Deleting a card is permanent.</p>
					<p>There is no undo.</p>
					<button
						class="w-full bg-red-600 hover:opacity-90 text-white rounded-lg py-2 px-4 font-medium disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed"
						disabled={$deleteItem.isPending}
						on:click={async () => {
							await $deleteItem.mutateAsync(item.id);

							goto(`/boards/${item.boardId}`);
						}}
					>
						Delete
					</button>
				</div>
			</CardPopover>
		</div>
	</div>
</div>
