<script lang="ts">
	import Board from '$lib/features/boards/components/board.svelte';
	import NewBoard from '$lib/features/boards/components/new-board.svelte';
	import { useBoards } from '$lib/features/boards/query-client/queries';
	import Button from '$lib/components/ui/button/button.svelte';
	import { toast } from 'svelte-sonner';
	import type { LayoutData } from '../$types';

	export let data: LayoutData;

	$: query = useBoards(data.boards);

	$: if ($query.isError) {
		toast.error($query.error.message);
	}
</script>

<div class="flex flex-1 flex-col mt-10">
	<div class="p-8">
		<h2 class="font-bold mb-2 text-xl">Boards</h2>
		<ul class="grid-container">
			{#each $query.data as board (board.id)}
				<li>
					<Board {board} class="w-full h-40" />
				</li>
			{/each}
			<li>
				<NewBoard let:trigger={triggerPopover}>
					<Button variant="secondary" class="w-full h-40" builders={[{ action: triggerPopover }]}>
						Create new board
					</Button>
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
