<script lang="ts">
	import { useQueryClient } from '@tanstack/svelte-query';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import type { ItemWithColumn } from '$lib/types';
	import ItemDestinationSelection from './ItemDestinationSelection.svelte';

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
				queryKey: ['boards', boardId.toString()]
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
	<button
		class="w-full bg-blue-600 hover:opacity-90 text-white rounded-lg py-2 px-4 font-medium disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed"
		disabled={!isValid || isSubmitting}
	>
		Move
	</button>
</form>
