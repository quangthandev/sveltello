<script lang="ts">
	import { useQueryClient } from '@tanstack/svelte-query';
	import EditableText from '$lib/components/shared/editable-text.svelte';
	import ItemSubtitle from './item-subtitle.svelte';
	import { getItemDetailsContext } from '../contexts/item-details.context';

	const itemDetails = getItemDetailsContext();

	const queryClient = useQueryClient();
</script>

<div class="flex items-start">
	<div class="grid grid-cols-item-section items-start mb-8 w-full">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-5 w-5 mt-1 text-neutral-700"
		>
			<rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
			<line x1="3" x2="21" y1="9" y2="9"></line>
			<line x1="9" x2="9" y1="21" y2="9"></line>
		</svg>
		<div class="-mt-1">
			<h3>
				<EditableText
					action="?/updateItemTitle"
					invalidateAll={false}
					fieldName="title"
					value={$itemDetails.title}
					inputClassName="text-xl w-full font-medium"
					buttonClassName="text-xl block text-left w-full font-medium"
					on:submitting={(event) => {
						const prevItemData = queryClient.getQueryData(['items', $itemDetails.id]);

						if (prevItemData) {
							queryClient.setQueryData(['items', $itemDetails.id], {
								...prevItemData,
								title: event.detail
							});
						}
					}}
					on:submitted={() => {
						queryClient.invalidateQueries({
							queryKey: ['items', $itemDetails.id]
						});
						queryClient.invalidateQueries({
							queryKey: ['boards', $itemDetails.boardId]
						});
					}}
				>
					<input type="hidden" name="id" value={$itemDetails.id} />
				</EditableText>
			</h3>
			<ItemSubtitle />
		</div>
	</div>
</div>
