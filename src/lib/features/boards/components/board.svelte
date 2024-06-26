<script lang="ts">
	import { enhance } from '$app/forms';
	import { cn } from '$lib/utils';
	import { useQueryClient } from '@tanstack/svelte-query';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import IconDelete from '$lib/components/icons/icon-delete.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Board } from '$lib/types';
	import type { TypedSubmitFunction } from '$lib/form';
	import type { ActionData } from '../../../../routes/(user)/boards/$types';

	export let board: Board;
	let className = '';
	export { className as class };

	const queryClient = useQueryClient();

	let isDeleting = false;

	$: ({ id, name, color, imageThumbUrl } = board);

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
		'block relative p-4 border-b-8 shadow rounded aspect-video',
		'bg-no-repeat bg-center bg-cover',
		'hover:shadow-lg hover:outline hover:outline-primary duration-200 will-change-transform',
		imageThumbUrl ? 'text-white' : 'bg-white text-black',
		className
	)}
	style:border-color={color}
	style:background-image={imageThumbUrl ? `url(${imageThumbUrl})` : 'none'}
>
	<div class="font-bold">{name}</div>
	<CardPopover title="Delete board" let:trigger={triggerPopover}>
		<Button
			variant="ghost"
			size="icon"
			builders={[{ action: triggerPopover }]}
			aria-label="Delete board"
			class="absolute top-2 right-2 text-muted-foreground"
		>
			<IconDelete />
		</Button>
		<div slot="content" class="space-y-4">
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
