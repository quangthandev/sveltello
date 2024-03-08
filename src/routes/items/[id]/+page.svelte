<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import ItemDetails from './ItemDetails.svelte';
	import Modal from '$lib/components/Modal.svelte';

	let previousPage: string = base;

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});
</script>

<Modal
	on:close={() => {
		goto(previousPage ? previousPage : `/boards`);
	}}
	class="w-9/12 lg:w-[768px]"
>
	<ItemDetails id={$page.params.id} />
</Modal>
