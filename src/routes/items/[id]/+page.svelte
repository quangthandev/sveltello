<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import ItemDetails from '$lib/features/items/components/ItemDetails.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { cn } from '$lib/utils';

	let previousPage: string = base;

	afterNavigate(({ from }) => {
		previousPage = from?.url.pathname || previousPage;
	});
</script>

<Modal
	on:close={() => {
		goto(previousPage ? previousPage : `/boards`);
	}}
	containerClass={cn('items-start mt-16')}
	class={cn('w-11/12 md:w-9/12 lg:w-[768px] overflow-y-scroll no-scrollbar')}
>
	<ItemDetails id={$page.params.id} />
</Modal>
