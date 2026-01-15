<script lang="ts">
	import { cn } from '$lib/utils';
	import { useBoards } from '$lib/features/boards/query-client/queries';
	import IconBoards from '$lib/components/icons/icon-boards.svelte';
	import NavLink from '$lib/components/nav/nav-link.svelte';
	import NewBoard from '$lib/features/boards/components/new-board.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import IconPlus from '$lib/components/icons/icon-plus.svelte';
	import type { Board } from '$lib/types';

	interface Props {
		initialBoards: Board[];
	}

	let { initialBoards }: Props = $props();

	const boardsQuery = $derived(useBoards(initialBoards));
</script>

<nav class="relative z-10 p-2">
	<ul class={cn('p-2 space-y-2')}>
		<NavLink href="/boards">
			<IconBoards />
			Boards
		</NavLink>
		<li class="space-y-4">
			<div class="flex items-center justify-between">
				<h2 class="font-medium">Your boards</h2>
				<NewBoard>
					{#snippet children({ targetId })}
						<Button
							variant="ghost"
							size="icon"
							popovertarget={targetId}
							aria-label="create new board"
						>
							<IconPlus />
						</Button>
					{/snippet}
				</NewBoard>
			</div>
			<ul class="space-y-2">
				{#each $boardsQuery.data ?? [] as board (board.id)}
					<NavLink href={`/boards/${board.id}`}>
						{#if board.imageThumbUrl}
							<img
								src={board.imageThumbUrl}
								alt={board.imageAltDescription || `Photo by ${board.imageUsername} on Unsplash`}
								class="object-cover aspect-[4/3] h-6 rounded-sm"
							/>
						{:else if board.color}
							<span style:background-color={board.color} class="w-8 h-6 rounded-sm"></span>
						{/if}
						<span class="overflow-hidden text-ellipsis">{board.name}</span>
					</NavLink>
				{/each}
			</ul>
		</li>
	</ul>
</nav>
