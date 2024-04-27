<script lang="ts">
	import IconAttachment from '$lib/components/icons/icon-attachment.svelte';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { useUploadImage } from '$lib/features/items/query-client/mutations';

	export let itemId: string;
	export let boardId: number;

	const uploadImageMutation = useUploadImage(itemId, boardId);

	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];

		if (!file) return;

		$uploadImageMutation.mutate(file);
	}
</script>

<CardPopover title="Attach" let:trigger={triggerPopover} class="w-80 z-50">
	<Button
		variant="secondary"
		class="flex justify-start gap-2"
		builders={[{ action: triggerPopover }]}
	>
		<IconAttachment />
		<span> Attachment </span>
	</Button>
	<div slot="content">
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
				on:change={handleFileChange}
			/>
		</div>
	</div>
</CardPopover>
