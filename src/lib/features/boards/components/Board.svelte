<script lang="ts">
	import { enhance } from '$app/forms';
	import { cn } from '$lib/utils';
	import type { TypedSubmitFunction } from '$lib/form';
	import type { Board } from '$lib/types';
	import CardPopover from '$lib/components/shared/CardPopover.svelte';
	import IconDelete from '$lib/components/icons/IconDelete.svelte';
	import type { ActionData } from '../../../../routes/boards/$types';
	import { useQueryClient } from '@tanstack/svelte-query';
	import Button from '$lib/components/ui/button/button.svelte';

	export let board: Board;
	let className = '';
	export { className as class };

	const queryClient = useQueryClient();

	let isDeleting = false;

	const { id, name, color, imageThumbUrl } = board;

	const handleSubmit: TypedSubmitFunction<ActionData> = () => {
		isDeleting = true;

		const prevBoards = queryClient.getQueryData<Board[]>(['boards']);

		if (prevBoards) {
			queryClient.setQueryData(
				['boards'],
				prevBoards.filter((board) => board.id !== id)
			);
		}

		return async ({ update }) => {
			await update({ invalidateAll: true });

			queryClient.invalidateQueries({
				queryKey: ['boards']
			});

			isDeleting = false;
		};
	};
</script>

<a
	href={`/boards/${id}`}
	class={cn(
		'p-4 block border-b-8 shadow rounded hover:shadow-lg relative aspect-video bg-no-repeat bg-center bg-cover',
		imageThumbUrl ? 'text-white' : 'bg-white text-black',
		className
	)}
	style:border-color={color}
	style:background-image={imageThumbUrl ? `url(${imageThumbUrl})` : 'none'}
>
	<div class="font-bold">{name}</div>
	<CardPopover title="Delete board" let:trigger={triggerPopover}>
		<Button
			variant="destructive"
			size="icon"
			builders={[{ action: triggerPopover }]}
			aria-label="Delete board"
			class="absolute top-2 right-2"
		>
			<IconDelete />
		</Button>
		<div slot="content" class="px-4 space-y-4">
			<p>Are you sure you want to delete this board?</p>
			<form method="post" action="?/delete" use:enhance={handleSubmit}>
				<input type="hidden" name="id" value={id} />
				<Button type="submit" variant="destructive" class="w-full" disabled={isDeleting}>
					Delete
				</Button>
			</form>
		</div>
	</CardPopover>
</a>
