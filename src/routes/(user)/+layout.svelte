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
	<Button
		variant="secondary"
		size="icon"
		class={cn(
			'fixed z-30 rounded-full translate-y-4 bg-slate-700 hover:bg-slate-500 text-white shadow-md',
			{
				hidden: open
			}
		)}
		aria-label="open sidebar"
		on:click={() => {
			open = true;
		}}
	>
		<IconChevronRight />
	</Button>
	<aside
		class={cn(
			'fixed bg-slate-700 text-white z-10 w-appSidebar h-full duration-200 will-change-transform border-r-2 border-r-slate-600',
			{
				'translate-x-0': open,
				'-translate-x-full': !open
			}
		)}
	>
		<div class="flex justify-end px-2 py-4 border-b-2 border-b-slate-400">
			<Button
				variant="ghost"
				size="icon"
				aria-label="open sidebar"
				class="mr-2"
				on:click={() => {
					open = false;
				}}
			>
				<IconChevronLeft />
			</Button>
		</div>
		<nav class="relative z-10 p-2">
			<ul class={cn('p-2 space-y-2')}>
				<li>
					<Button variant="ghost" href="/boards" class="flex justify-start items-center gap-2">
						<IconBoards />
						Boards
					</Button>
				</li>
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
		<Button
			variant="secondary"
			size="sm"
			class={cn(
				'absolute inset-0 w-5 h-full p-0 rounded-none bg-slate-700 hover:bg-slate-500 duration-200 will-change-transform',
				{
					'opacity-0': open,
					'opacity-100 translate-x-[var(--app-sidebar-width)]': !open
				}
			)}
			aria-label="open sidebar"
			on:click={() => (open = true)}
		></Button>
	</aside>
	<main
		class={cn('w-full h-full', {
			'pl-[var(--app-sidebar-width)]': open,
			'pl-4': !open
		})}
	>
		<slot />
	</main>
</div>
