<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';
	import { cn } from '$lib/utils';
	import type { Column, Item } from '@prisma/client';
	import ItemDetails from '../../items/[id]/ItemDetails.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';

	export let title: string;
	export let content: string | null;
	export let id: string;
	let className: string | undefined = undefined;
	export { className as class };

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
	<div
		class="bg-white shadow shadow-slate-300 border-4 border-transparent text-sm rounded-lg w-full py-1 px-2 relative hover:border-cyan-500"
	>
		<h3>{title}</h3>
		{#if content}
			<div class="mt-2 truncate">{@html content}</div>
		{:else}
			<span>&nbsp;</span>
		{/if}
	</div>
</a>

{#if pageState.id && pageState.id === id}
	<Modal on:close={() => history.back()} class="w-9/12 lg:w-[768px]">
		<ItemDetails {id} on:close={() => history.back()} />
	</Modal>
{/if}
