<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import ItemDestinationSelection from './item-destination-selection.svelte';
	import { getItemDetailsContext } from '../contexts/item-details.context';

	interface Props {
		initialPosIndex: number;
		onSubmitted?: () => void;
	}

	let { initialPosIndex, onSubmitted }: Props = $props();

	const itemDetails = getItemDetailsContext();

	let textarea = $state<HTMLTextAreaElement | null>(null);

	// Form states
	let isValid = $state(false);
	let isSubmitting = $state(false);

	const queryClient = useQueryClient();

	onMount(() => {
		textarea?.select();
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
			onSubmitted?.();
			goto(`/boards/${$itemDetails.boardId}`);
		};
	}}
>
	<label for="title">
		Title
		<textarea
			name="title"
			id="title"
			rows="3"
			class="w-full bg-gray-200 mt-2 px-4 py-2"
			value={$itemDetails.title}
			bind:this={textarea}
		></textarea>
	</label>
	<fieldset class="space-y-2">
		<legend>Copy to...</legend>
		<ItemDestinationSelection {initialPosIndex} onValidate={(status) => (isValid = status)} />
	</fieldset>
	<Button type="submit" class="w-full" disabled={!isValid || isSubmitting}>Create card</Button>
</form>
