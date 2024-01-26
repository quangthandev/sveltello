<script>
	import Board from './Board.svelte';
	import NewBoard from './NewBoard.svelte';

	export let data;
</script>

<div class="flex min-h-full flex-1 flex-col mt-10">
	<NewBoard />
	<div class="p-8">
		<h2 class="font-bold mb-2 text-xl">Boards</h2>
		<nav class="flex flex-wrap gap-8">
			{#each data.boards as board (board.id)}
				<Board {board} />
			{/each}
		</nav>
	</div>
</div>
