<script lang="ts">
	import { useQueryClient } from '@tanstack/svelte-query';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import type { ItemWithColumn } from '$lib/types';
	import ItemDestinationSelection from './item-destination-selection.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	export let item: ItemWithColumn;
	export let initialPosIndex: number;
	const { boardId } = item;

	const queryClient = useQueryClient();

	// Form states
	let isValid = false;
	let isSubmitting = false;

	const dispatch = createEventDispatcher();
</script>

<form
	class="space-y-2"
	method="post"
	action="?/moveItemToDestination"
	use:enhance={() => {
		isSubmitting = true;

		return async ({ update }) => {
			await update({ invalidateAll: false });

			queryClient.invalidateQueries({
				queryKey: ['boards', boardId]
			});
			queryClient.invalidateQueries({
				queryKey: ['items', item.id]
			});

			isSubmitting = false;
			dispatch('close');
			goto(`/boards/${boardId}`);
		};
	}}
>
	<input type="title" hidden name="title" value={item.title} />
	<ItemDestinationSelection
		{item}
		{initialPosIndex}
		on:validate={(e) => {
			isValid = e.detail.isValid;
		}}
	/>
	<Button type="submit" class="w-full" disabled={!isValid || isSubmitting}>Move</Button>
</form>
