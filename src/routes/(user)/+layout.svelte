<script>
	import IconBoards from '$lib/components/icons/icon-boards.svelte';
	import IconChevronLeft from '$lib/components/icons/icon-chevron-left.svelte';
	import IconChevronRight from '$lib/components/icons/icon-chevron-right.svelte';
	import IconPlus from '$lib/components/icons/icon-plus.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import NewBoard from '$lib/features/boards/components/new-board.svelte';
	import { useBoards } from '$lib/features/boards/query-client/queries';
	import { cn } from '$lib/utils';

	const boardsQuery = useBoards();

	let open = true;
</script>

<div class="flex flex-grow h-full">
	<aside class="relative bg-slate-700 text-white z-10 h-full">
		<Button
			variant={open ? 'ghost' : 'secondary'}
			size="icon"
			class={cn('absolute top-4 z-10', {
				'rounded-full': !open,
				'right-4': open,
				'left-2': !open
			})}
			aria-label={open ? 'close sidebar' : 'open sidebar'}
			on:click={() => {
				open = !open;
			}}
		>
			<svelte:component this={open ? IconChevronLeft : IconChevronRight} />
		</Button>
		<Button
			variant="secondary"
			class={cn('absolute w-[8px] rounded-none bg-neutral-500', {
				'opacity-0': open,
				'h-full opacity-100': !open
			})}
			on:click={() => (open = true)}
		></Button>
		<!-- Spacer -->
		<div
			class={cn({
				'w-64': open,
				'w-2': !open
			})}
		></div>
		<nav
			class={cn('p-4 mt-12 bg-slate-700 duration-200 will-change-transform', {
				'translate-x-0': open,
				'-translate-x-full': !open
			})}
		>
			<ul
				class={cn('space-y-2', {
					hidden: !open
				})}
			>
				<li>
					<Button variant="ghost" href="/boards" class="flex justify-start items-center gap-2">
						<IconBoards />
						Boards
					</Button>
				</li>
				<hr />
				<li>
					<h2 class="mb-4 font-medium flex justify-between items-center">
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
							<li>
								<Button
									variant="ghost"
									href={`/boards/${board.id}`}
									class="flex justify-start gap-2"
								>
									<img src={board.imageThumbUrl} alt={board.name} class="w-8 h-8 rounded-sm" />
									{board.name}
								</Button>
							</li>
						{/each}
					</ul>
				</li>
			</ul>
		</nav>
	</aside>
	<slot />
</div>
