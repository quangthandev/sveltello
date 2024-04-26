<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import ItemDestinationSelection from './item-destination-selection.svelte';
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import type { ItemWithColumn } from '$lib/types';
	import Button from '$lib/components/ui/button/button.svelte';

	export let item: ItemWithColumn;
	export let initialPosIndex: number;

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
				queryKey: ['boards', item.boardId]
			});
			queryClient.invalidateQueries({
				queryKey: ['items', item.id]
			});

			isSubmitting = false;
			dispatch('close');
			goto(`/boards/${item.boardId}`);
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
			value={item.title}
			bind:this={textarea}
		></textarea>
	</fieldset>
	<h4>Copy to...</h4>
	<ItemDestinationSelection
		{item}
		{initialPosIndex}
		on:validate={(e) => {
			isValid = e.detail.isValid;
		}}
	/>
	<Button type="submit" class="w-full" disabled={!isValid || isSubmitting}>Create card</Button>
</form>
