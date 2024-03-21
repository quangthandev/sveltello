<script lang="ts">
	import { cn, getRelativeTime } from '$lib/utils';
	import type { Attachment } from '@prisma/client';
	import * as Popover from '$lib/components/popover';
	import IconClose from '$lib/components/icons/IconClose.svelte';
	import IconAttachment from '$lib/components/icons/IconAttachment.svelte';
	import { queriesCtx } from './context';

	export let itemId: string;
	export let attachments: Attachment[];

	const { deleteAttachment } = queriesCtx.get();

	const deleteMutation = deleteAttachment(itemId);
</script>

<div class="relative flex items-start gap-x-2 mb-8 w-full">
	<IconAttachment />
	<div class="px-2 w-full">
		<h3 class="text-xl font-medium mb-4">Attachments</h3>
		<ul class="flex flex-col gap-2">
			{#each attachments as attachment (attachment.id)}
				<li class="attachment-container p-2 bg-gray-50 rounded-md">
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

					<div class="flex flex-col gap-1">
						<p class="font-bold">{attachment.name}</p>
						<p class="flex gap-2 text-sm text-muted-foreground">
							<span>
								Added {getRelativeTime(attachment.createdAt)}
							</span>
							<span>
								<Popover.Root>
									<Popover.Trigger class="underline">Delete</Popover.Trigger>
									<Popover.Content
										class={cn(
											'absolute top-0 left-0 bg-white shadow-2xl py-4 rounded-lg w-80 z-50 border-2 border-gray-200'
										)}
									>
										<header>
											<header class="relative mb-4">
												<h3 class="font-bold text-center">Delete Attachment</h3>
												<Popover.Close
													class="absolute -top-2 right-2 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
													aria-label="close"
												>
													<IconClose />
												</Popover.Close>
											</header>
										</header>
										<div class="px-4 space-y-4">
											<div>
												<p>Deleting an attachment is permanent.</p>
												<p>There is no undo.</p>
											</div>
											<button
												class="w-full bg-red-600 hover:opacity-90 text-white rounded-lg py-2 px-4 font-medium disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed"
												disabled={$deleteMutation.isPending}
												on:click={() => $deleteMutation.mutate(attachment.id)}
											>
												Delete
											</button>
										</div>
									</Popover.Content>
								</Popover.Root>
							</span>
						</p>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.attachment-container {
		display: grid;
		align-items: center;
		grid-template-columns: 100px 1fr;
		gap: 1rem;
	}
</style>
