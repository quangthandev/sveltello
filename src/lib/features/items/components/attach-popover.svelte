<script lang="ts">
	import IconAttachment from '$lib/components/icons/icon-attachment.svelte';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { useUploadImage } from '$lib/features/items/query-client/mutations';

	interface Props {
		itemId: string;
		boardId: number;
	}

	let { itemId, boardId }: Props = $props();

	const uploadImageMutation = $derived(useUploadImage(itemId, boardId));

	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];

		if (!file) return;

		$uploadImageMutation.mutate(file);
	}
</script>

<CardPopover title="Attach" targetId={`${itemId}_attachment`} class="w-80 z-50">
	{#snippet children({ targetId })}
		<Button variant="secondary" class="flex justify-start gap-2" popovertarget={targetId}>
			<IconAttachment />
			<span> Attachment </span>
		</Button>
	{/snippet}
	{#snippet content()}
		<div>
			<div class="px-4 space-y-4">
				<h4 class="font-medium">Add a file from your computer</h4>
				<p>You can also drag and drop files to upload them</p>
				<label
					for="item-attachment-file-picker"
					class={cn(
						'flex items-center justify-center w-full p-2 rounded-md bg-gray-300 hover:bg-gray-300/80 cursor-pointer',
						{ 'opacity-50 cursor-not-allowed': $uploadImageMutation.isPending }
					)}
				>
					Choose a file
				</label>
				<input
					id="item-attachment-file-picker"
					name="item-attachment-file-picker"
					type="file"
					accept="image/*, application/pdf"
					hidden
					disabled={$uploadImageMutation.isPending}
					onchange={handleFileChange}
				/>
			</div>
		</div>
	{/snippet}
</CardPopover>
