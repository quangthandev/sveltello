<script>
	import { cn } from '$lib/utils';
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
		<ul class="grid-container">
			{#each data.boards as board (board.id)}
				<li>
					<Board {board} class="w-full h-40" />
				</li>
			{/each}
			<li>
				<NewBoard let:trigger>
					<button
						class={cn(
							'w-full h-40 font-medium text-lg bg-neutral-200 hover:bg-neutral-300 rounded-md'
						)}
						use:trigger
					>
						Create new board
					</button>
				</NewBoard>
			</li>
		</ul>
	</div>
</div>

<style>
	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
		gap: 1rem;
	}
</style>
