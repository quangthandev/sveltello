<script lang="ts">
	import { goto, pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/components/Modal.svelte';
	import { cn } from '$lib/utils';
	import type { Column, Item } from '@prisma/client';
	import ItemDetails from '../../items/[id]/ItemDetails.svelte';
	import { queriesCtx } from './context';
	import { useQueryClient } from '@tanstack/svelte-query';

	export let title: string;
	export let content: string | null;
	export let id: string;
	let className: string | undefined = undefined;
	export { className as class };

	const { deleteItem } = queriesCtx.get();

	const queryClient = useQueryClient();

	let pageState: App.PageState & { item?: Item & { column: Column } };
	$: pageState = $page.state;

	async function handleClick(e: MouseEvent) {
		e.preventDefault();

		const { href } = e.currentTarget as HTMLAnchorElement;

		const data = await queryClient.fetchQuery<Item & { column: Column }>({
			queryKey: ['items', id],
			queryFn: async () => {
				const res = await fetch(`/items/${id}`);
				return res.json();
			}
		});

		if (data) {
			pushState(href, { item: data });
		} else {
			goto(href);
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
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
			<div class="mt-2">{content}</div>
		{:else}
			<span>&nbsp;</span>
		{/if}
		<button
			aria-label="Delete card"
			class="absolute top-4 right-4 text-gray-400 hover:text-red-500"
			type="submit"
			on:click={(event) => {
				event.stopPropagation();

				$deleteItem.mutate(id);
			}}
		>
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					fill="currentColor"
				>
					<title>delete</title>
					<path
						d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
					/>
				</svg>
			</span>
		</button>
	</div>
</a>

{#if pageState.item}
	<Modal on:close={() => history.back()} class="w-9/12 lg:w-[768px]">
		<ItemDetails id={pageState.item.id} />
	</Modal>
{/if}
