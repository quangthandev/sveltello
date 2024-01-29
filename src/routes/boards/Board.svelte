<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Board } from '@prisma/client';

	export let board: Board;

	const { id, name, color } = board;
</script>

<a
	href={`/boards/${id}`}
	class="w-60 h-40 p-4 block border-b-8 shadow rounded hover:shadow-lg bg-white relative"
	style:border-color={color}
>
	<div class="font-bold">{name}</div>
	<form method="post" action="?/delete" use:enhance>
		<input type="hidden" name="boardId" value={id} />
		<button
			aria-label="Delete board"
			class="absolute top-4 right-4 text-gray-400 hover:text-red-500"
			type="submit"
			on:click={(event) => {
				event.stopPropagation();
			}}
		>
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					fill="currentColor"
				>
					<title>delete</title>
					<path
						d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
					/>
				</svg>
			</span>
		</button>
	</form>
</a>
