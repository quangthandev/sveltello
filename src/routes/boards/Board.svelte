<script lang="ts">
	import { enhance } from '$app/forms';
	import CardPopover from '$lib/components/CardPopover.svelte';
	import { cn } from '$lib/utils';
	import type { Board } from '@prisma/client';

	export let board: Board;
	let className = '';
	export { className as class };

	const { id, name, color, imageThumbUrl } = board;
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
	<CardPopover title="Delete board" let:trigger>
		<button
			aria-label="Delete board"
			class="absolute top-4 right-4 text-gray-400 hover:text-red-500"
			use:trigger
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="24"
				height="24"
				fill="currentColor"
			>
				<path
					d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
				/>
			</svg>
		</button>
		<div slot="content" class="px-4 space-y-4">
			<p>Are you sure you want to delete this board?</p>
			<form method="post" action="?/delete" use:enhance>
				<input type="hidden" name="boardId" value={id} />
				<button
					class="w-full bg-red-600 hover:opacity-90 text-white rounded-lg py-2 px-4 font-medium disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed"
				>
					Delete
				</button>
			</form>
		</div>
	</CardPopover>
</a>
