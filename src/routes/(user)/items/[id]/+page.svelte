<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import ItemDetails from '$lib/features/items/components/item-details.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let previousPage = $state(`/boards/${data.item.boardId}`);

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});
</script>

{#if page.params.id}
	<ItemDetails
		id={page.params.id}
		initialData={data.item}
		onClose={() =>
			goto(previousPage, {
				state: { id: data.item.id }
			})}
	/>
{/if}
