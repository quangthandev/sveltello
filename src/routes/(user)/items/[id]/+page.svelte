<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ItemDetails from '$lib/features/items/components/item-details.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let previousPage = `/boards/${data.item.boardId}`;

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});
</script>

<ItemDetails id={$page.params.id} initialData={data.item} on:close={() => goto(previousPage)} />
