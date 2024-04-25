<script lang="ts">
	import IconAttachment from '$lib/components/icons/IconAttachment.svelte';
	import IconClose from '$lib/components/icons/IconClose.svelte';
	import * as Popover from '$lib/components/popover';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { useUploadImage } from '../query-client/mutations';

	export let itemId: string;
	export let boardId: number;

	const uploadImageMutation = useUploadImage(itemId, boardId);

	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];

		if (!file) return;

		$uploadImageMutation.mutate(file);
	}
</script>

<Popover.Root>
	<Popover.Trigger asChild let:triggerAction={triggerPopover}>
		<Button
			variant="secondary"
			class="flex justify-start gap-2"
			builders={[{ action: triggerPopover }]}
		>
			<IconAttachment />
			<span> Attachment </span>
		</Button>
	</Popover.Trigger>

	<Popover.Content
		class={cn(
			'absolute top-0 left-0 bg-white shadow-2xl py-4 rounded-lg w-80 z-50 border-2 border-gray-200'
		)}
	>
		<header class="relative mb-4">
			<h3 class="font-bold text-center">Attach</h3>
			<Popover.Close
				class="absolute -top-2 right-2 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
				aria-label="close"
			>
				<IconClose />
			</Popover.Close>
		</header>
		<div class="px-4 space-y-4">
			<h4 class="font-medium">Add a file from your computer</h4>
			<p>You can also drag and drop files to upload them</p>
			<label
				for="item-attachment-file-picker"
				class={cn(
					'flex items-center justify-center w-full p-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer',
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
	</Popover.Content>
</Popover.Root>
