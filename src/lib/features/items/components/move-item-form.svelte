<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { useQueryClient } from '@tanstack/svelte-query';
	import Button from '$lib/components/ui/button/button.svelte';
	import ItemDestinationSelection from './item-destination-selection.svelte';
	import { getItemDetailsContext } from '../contexts/item-details.context';

	export let initialPosIndex: number;

	const itemDetails = getItemDetailsContext();

	const { boardId } = $itemDetails;

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
				queryKey: ['items', $itemDetails.id]
			});

			isSubmitting = false;
			dispatch('close');
			goto(`/boards/${boardId}`);
		};
	}}
>
	<input type="title" hidden name="title" value={$itemDetails.title} />
	<ItemDestinationSelection
		{initialPosIndex}
		on:validate={(e) => {
			isValid = e.detail.isValid;
		}}
	/>
	<Button type="submit" class="w-full" disabled={!isValid || isSubmitting}>Move</Button>
</form>
