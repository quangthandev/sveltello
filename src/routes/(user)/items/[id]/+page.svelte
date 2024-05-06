<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ItemDetails from '$lib/features/items/components/item-details.svelte';
	import Modal from '$lib/components/ui/modal.svelte';
	import { cn } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	let previousPage = `/boards/${data.item.boardId}`;

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});
</script>

<Modal
	on:close={() => goto(previousPage)}
	containerClass={cn('items-start mt-16')}
	class={cn('w-11/12 md:w-9/12 lg:w-[768px] overflow-y-scroll no-scrollbar')}
>
	<ItemDetails id={$page.params.id} on:close={() => goto(previousPage)} />
</Modal>
