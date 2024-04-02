<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';
	import { cn } from '$lib/utils';
	import type { Column, Cover, Item } from '@prisma/client';
	import ItemDetails from '../../items/[id]/ItemDetails.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import IconAttachment from '$lib/components/icons/IconAttachment.svelte';

	export let title: string;
	export let content: string | null;
	export let id: string;
	let className: string | undefined = undefined;
	export { className as class };
	export let cover: Cover | null;
	export let attachmentsCount: number;

	const queryClient = useQueryClient();

	let pageState: App.PageState & { id?: string };
	$: pageState = $page.state;

	function handleClick(e: MouseEvent) {
		e.preventDefault();

		const { href } = e.currentTarget as HTMLAnchorElement;

		queryClient.prefetchQuery<Item & { column: Column }>({
			queryKey: ['items', id],
			queryFn: async () => {
				const res = await fetch(`/items/${id}`);
				return res.json();
			}
		});

		pushState(href, { id });
	}
</script>

<a
	href="/items/{id}"
	class={cn(
		'border-t-2 border-b-2 -mb-[2px] last:mb-0 px-2 py-1 border-t-transparent border-b-transparent',
		className
	)}
	on:click={handleClick}
>
	{#if cover}
		<div class="h-48 bg-cover rounded-t-lg" style:background-image={`url(${cover.url})`}></div>
	{/if}
	<div
		class={cn(
			'bg-white shadow shadow-slate-300 border-4 border-transparent text-sm w-full py-1 px-2 relative hover:border-cyan-500 space-y-2',
			cover ? 'rounded-b-lg' : 'rounded-lg'
		)}
	>
		<h3>{title}</h3>
		{#if content || attachmentsCount}
			<div class="flex items-center gap-2">
				{#if content}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						fill="currentColor"
					>
						<title>description</title>
						<path
							d="M5,9.5L7.5,14H2.5L5,9.5M3,4H7V8H3V4M5,20A2,2 0 0,0 7,18A2,2 0 0,0 5,16A2,2 0 0,0 3,18A2,2 0 0,0 5,20M9,5V7H21V5H9M9,19H21V17H9V19M9,13H21V11H9V13Z"
						/>
					</svg>
				{/if}
				{#if attachmentsCount}
					<span class="flex gap-1" title="attachments">
						<IconAttachment />
						{attachmentsCount}
					</span>
				{/if}
			</div>
		{/if}
	</div>
</a>

{#if pageState.id && pageState.id === id}
	<Modal
		on:close={() => history.back()}
		class="w-11/12 md:w-9/12 lg:w-[768px] overflow-y-scroll no-scrollbar"
	>
		<ItemDetails {id} on:close={() => history.back()} />
	</Modal>
{/if}
