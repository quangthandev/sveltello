<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { useQueryClient } from '@tanstack/svelte-query';
	import Button from '$lib/components/ui/button/button.svelte';
	import ItemDestinationSelection from './item-destination-selection.svelte';
	import { getItemDetailsContext } from '../contexts/item-details.context';

	interface Props {
		initialPosIndex: number;
		onSubmitted?: () => void;
	}

	let { initialPosIndex, onSubmitted }: Props = $props();

	const itemDetails = getItemDetailsContext();

	const { boardId } = $itemDetails;

	const queryClient = useQueryClient();

	// Form states
	let isValid = $state(false);
	let isSubmitting = $state(false);
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
			onSubmitted?.();
			goto(`/boards/${boardId}`);
		};
	}}
>
	<input type="title" hidden name="title" value={$itemDetails.title} />
	<fieldset class="space-y-2">
		<legend>Select destination</legend>
		<ItemDestinationSelection {initialPosIndex} onValidate={(status) => (isValid = status)} />
	</fieldset>
	<Button type="submit" class="w-full" disabled={!isValid || isSubmitting}>Move</Button>
</form>
