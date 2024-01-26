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
			class="absolute top-4 right-4 hover:text-brand-red"
			type="submit"
			on:click={(event) => {
				event.stopPropagation();
			}}
		>
			Delete
		</button>
	</form>
</a>
