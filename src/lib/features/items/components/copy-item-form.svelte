<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import ItemDestinationSelection from './item-destination-selection.svelte';
	import { getItemDetailsContext } from '../contexts/item-details.context';

	export let initialPosIndex: number;

	const itemDetails = getItemDetailsContext();

	let textarea: HTMLTextAreaElement;

	// Form states
	let isValid = false;
	let isSubmitting = false;

	const dispatch = createEventDispatcher();

	const queryClient = useQueryClient();

	onMount(() => {
		textarea.select();
	});
</script>

<form
	method="post"
	action="?/copyItem"
	class="flex flex-col gap-2"
	use:enhance={() => {
		isSubmitting = true;

		return async ({ update }) => {
			await update({ invalidateAll: false });

			queryClient.invalidateQueries({
				queryKey: ['boards', $itemDetails.boardId]
			});
			queryClient.invalidateQueries({
				queryKey: ['items', $itemDetails.id]
			});

			isSubmitting = false;
			dispatch('close');
			goto(`/boards/${$itemDetails.boardId}`);
		};
	}}
>
	<fieldset>
		<label for="title">Title</label>
		<textarea
			name="title"
			id="title"
			rows="3"
			class="w-full bg-gray-200 mt-2 px-4 py-2"
			value={$itemDetails.title}
			bind:this={textarea}
		></textarea>
	</fieldset>
	<h4>Copy to...</h4>
	<ItemDestinationSelection
		{initialPosIndex}
		on:validate={(e) => {
			isValid = e.detail.isValid;
		}}
	/>
	<Button type="submit" class="w-full" disabled={!isValid || isSubmitting}>Create card</Button>
</form>
