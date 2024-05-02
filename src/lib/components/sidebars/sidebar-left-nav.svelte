<script lang="ts">
	import { cn } from '$lib/utils';
	import { useBoards } from '$lib/features/boards/query-client/queries';
	import IconBoards from '$lib/components/icons/icon-boards.svelte';
	import NavLink from '$lib/components/nav/nav-link.svelte';
	import NewBoard from '$lib/features/boards/components/new-board.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import IconPlus from '$lib/components/icons/icon-plus.svelte';

	const boardsQuery = useBoards();
</script>

<nav class="relative z-10 p-2">
	<ul class={cn('p-2 space-y-2')}>
		<NavLink href="/boards">
			<IconBoards />
			Boards
		</NavLink>
		<li>
			<h2 class="ml-2 mb-4 font-medium flex justify-between items-center">
				<span>Your boards</span>
				<NewBoard let:trigger={triggerPopover}>
					<Button
						variant="ghost"
						size="icon"
						builders={[{ action: triggerPopover }]}
						aria-label="create new board"
					>
						<IconPlus />
					</Button>
				</NewBoard>
			</h2>
			<ul class="space-y-2">
				{#each $boardsQuery.data ?? [] as board (board.id)}
					<NavLink href={`/boards/${board.id}`} title={board.name}>
						<img
							src={board.imageThumbUrl}
							alt={board.imageAltDescription || `Photo by ${board.imageUsername} on Unsplash`}
							class="object-cover aspect-[4/3] h-6 rounded-sm"
						/>
						<span class="overflow-hidden text-ellipsis">{board.name}</span>
					</NavLink>
				{/each}
			</ul>
		</li>
	</ul>
</nav>
