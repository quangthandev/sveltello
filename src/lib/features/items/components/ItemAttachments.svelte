<script lang="ts">
	import { getRelativeTime } from '$lib/utils';
	import IconAttachment from '$lib/components/icons/IconAttachment.svelte';
	import CardPopover from '$lib/components/shared/CardPopover.svelte';
	import { enhance } from '$app/forms';
	import type { TypedSubmitFunction } from '$lib/form';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { Attachment, ItemFullPayload } from '$lib/types';
	import type { ActionData } from '../../../../routes/items/[id]/$types';
	import { useDeleteAttachment } from '../query-client/mutations';

	export let itemId: string;
	export let attachments: (Attachment & { isCover: boolean })[];

	const queryClient = useQueryClient();

	const deleteAttachmentMutation = useDeleteAttachment(itemId);

	const handleMakeCover: TypedSubmitFunction<ActionData> = ({ formData }) => {
		const attachmentId = formData.get('attachmentId');

		const item = queryClient.getQueryData<ItemFullPayload>(['items', itemId]);

		if (!item) {
			return;
		}

		const newAttachments = item.attachments.map((attachment) => ({
			...attachment,
			isCover: attachment.id === attachmentId
		}));

		queryClient.setQueryData(['items', itemId], {
			...item,
			attachments: newAttachments
		});

		return async ({ update }) => {
			await update({ invalidateAll: false });

			queryClient.invalidateQueries({ queryKey: ['items', itemId] });
			queryClient.invalidateQueries({ queryKey: ['boards', item.boardId] });
		};
	};
</script>

<section class="grid grid-cols-item-section items-start">
	<IconAttachment />
	<div class="px-2 w-full">
		<h3 class="text-xl font-medium mb-4">Attachments</h3>
		<ul class="flex flex-col gap-2">
			{#each attachments as attachment (attachment.id)}
				<li
					class="grid items-center grid-cols-1 sm:grid-cols-attachment gap-4 p-2 bg-gray-50 rounded-md"
				>
					<a href={attachment.url} target="_blank" rel="noreferer noopener">
						{#if attachment.type.startsWith('image/')}
							<img
								src={attachment.url}
								alt={attachment.name}
								class="object-cover aspect-[3/2] rounded-md"
							/>
						{:else if attachment.type === 'application/pdf'}
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path
									d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M9.5 11.5C9.5 12.3 8.8 13 8 13H7V15H5.5V9H8C8.8 9 9.5 9.7 9.5 10.5V11.5M14.5 13.5C14.5 14.3 13.8 15 13 15H10.5V9H13C13.8 9 14.5 9.7 14.5 10.5V13.5M18.5 10.5H17V11.5H18.5V13H17V15H15.5V9H18.5V10.5M12 10.5H13V13.5H12V10.5M7 10.5H8V11.5H7V10.5Z"
								/>
							</svg>
						{/if}
					</a>

					<div class="flex flex-col gap-1 items-start">
						<p class="font-bold attachment-name">{attachment.name}</p>
						<p class="flex gap-2 text-sm text-muted-foreground">
							<span>
								Added {getRelativeTime(attachment.createdAt)}
							</span>
							<span>
								<CardPopover title="Delete Attachment" let:trigger>
									<button use:trigger class="underline"> Delete </button>
									<div slot="content" class="px-4 space-y-4">
										<p>Deleting an attachment is permanent.</p>
										<p>There is no undo.</p>
										<button
											class="w-full bg-red-600 hover:opacity-90 text-white rounded-lg py-2 px-4 font-medium disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed"
											disabled={$deleteAttachmentMutation.isPending}
											on:click={() => $deleteAttachmentMutation.mutate(attachment.id)}
										>
											Delete
										</button>
									</div>
								</CardPopover>
							</span>
						</p>
						{#if !attachment.isCover && attachment.type.startsWith('image/')}
							<form action="?/makeCover" method="post" use:enhance={handleMakeCover}>
								<input type="hidden" name="attachmentId" value={attachment.id} />
								<button class="underline text-sm text-muted-foreground">Make cover</button>
							</form>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.attachment-name {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
</style>
