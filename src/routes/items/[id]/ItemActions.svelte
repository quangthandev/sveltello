<script lang="ts">
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import IconDelete from '$lib/components/icons/IconDelete.svelte';
	import IconCopy from '$lib/components/icons/IconCopy.svelte';
	import { cn } from '$lib/utils';
	import MoveOrCopyItemPopover from './MoveOrCopyItemPopover.svelte';
	import type { ItemWithColumn } from '../../types';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import type { Board, Column, Item } from '@prisma/client';

	export let item: ItemWithColumn;
	export { className as class };

	let className: string | undefined = '';

	const queryClient = useQueryClient();

	const deleteItem = createMutation<unknown, unknown, string>({
		mutationFn: async (id) =>
			(
				await fetch(`/items/${id}`, {
					method: 'DELETE'
				})
			).json(),
		onMutate: async (id) => {
			const prevBoardData = queryClient.getQueryData<
				Board & { items: Omit<Item, 'content'>[]; columns: (Column & { items: Item[] })[] }
			>(['boards', item.boardId.toString()]);

			if (prevBoardData) {
				queryClient.setQueryData(['boards', item.boardId.toString()], {
					...prevBoardData,
					columns: prevBoardData.columns.map((column) => ({
						...column,
						items: column.items.filter((item) => item.id !== id)
					}))
				});
			}

			return { prevBoardData };
		},
		onError: (_err, _variables, context: any) => {
			if (context?.prevBoardData) {
				queryClient.setQueryData(['boards', item.boardId.toString()], context.prevBoardData);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['boards', item.boardId.toString()] });
		}
	});
</script>

<div class={cn('space-y-2', className)}>
	<h4>Actions</h4>
	<div class="flex md:flex-col gap-2">
		<MoveOrCopyItemPopover {item} let:trigger>
			<button
				use:trigger
				class="flex items-center gap-2 w-full p-2 rounded-md bg-gray-200 hover:bg-gray-300"
			>
				<IconArrowRight />
				Move
			</button>
		</MoveOrCopyItemPopover>
		<button
			class="flex items-center gap-2 w-full p-2 rounded-md bg-gray-200 hover:bg-gray-300"
			on:click={() => $deleteItem.mutate(item.id)}
		>
			<IconDelete />
			Delete
		</button>
		<MoveOrCopyItemPopover {item} action="copy" let:trigger>
			<button
				use:trigger
				class="flex items-center gap-2 w-full p-2 rounded-md bg-gray-200 hover:bg-gray-300"
			>
				<IconCopy />
				Copy
			</button>
		</MoveOrCopyItemPopover>
	</div>
</div>
