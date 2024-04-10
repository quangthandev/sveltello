<script lang="ts">
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import IconDelete from '$lib/components/icons/IconDelete.svelte';
	import IconCopy from '$lib/components/icons/IconCopy.svelte';
	import { cn } from '$lib/utils';
	import MoveOrCopyItemPopover from './MoveOrCopyItemPopover.svelte';
	import type { ItemFullPayload } from '../../types';
	import AttachPopover from './AttachPopover.svelte';
	import { queriesCtx } from './context';
	import { goto } from '$app/navigation';

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
			<button
				class="flex items-center gap-2 w-full p-2 rounded-md bg-gray-200 hover:bg-gray-300"
				on:click={async () => {
					await $deleteItem.mutateAsync(item.id);

					goto(`/boards/${item.boardId}`);
				}}
			>
				<IconDelete />
				Delete
			</button>
		</div>
	</div>
</div>
