<script>
	import Board from './Board.svelte';
	import NewBoard from './NewBoard.svelte';

	export let data;
</script>

<svelte:head>
	<title>Boards</title>
</svelte:head>

<div class="flex min-h-full flex-1 flex-col mt-10">
	<div class="p-8">
		<h2 class="font-bold mb-2 text-xl">Boards</h2>
		<ul class="flex flex-wrap gap-8">
			{#each data.boards as board (board.id)}
				<li>
					<Board {board} />
				</li>
			{/each}
			<li>
				<NewBoard />
			</li>
		</ul>
	</div>
</div>
