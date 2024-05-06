<script lang="ts">
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import PhotosPicker from '$lib/components/shared/photos-picker.svelte';
	import UnsplashPhotosPicker from '$lib/features/unsplash/components/unsplash-photos-picker.svelte';
	import type { TypedSubmitFunction } from '$lib/form';
	import type { Attachment, Cover } from '$lib/types';
	import type { Random } from 'unsplash-js/dist/methods/photos/types';
	import type { ActionData } from '../../../../routes/(user)/items/[id]/$types';

	export let itemId: string;
	export let cover: Cover | null;
	export let attachments: Attachment[];

	let makeCoverFromUnsplashFormElm: HTMLFormElement;
	let makeCoverFromAttachmentFormElm: HTMLFormElement;
	let attachmentsPicker: PhotosPicker | null;
	let unsplashPhotosPicker: UnsplashPhotosPicker | null;

	const queryClient = useQueryClient();

	const handleMakeCoverFromAttachment: TypedSubmitFunction<ActionData> = ({ formData }) => {
		const selectedAttachment = attachments.find(
			(attachment) => attachment.id === formData.get('photo')
		);

		if (selectedAttachment) {
			formData.set('attachmentId', selectedAttachment.id);
		}

		formData.delete('photo');

		return async ({ update }) => {
			await update({ invalidateAll: false });

			unsplashPhotosPicker?.resetSelection();
			queryClient.invalidateQueries({
				queryKey: ['items', itemId]
			});
		};
	};

	const handleMakeCoverFromUnsplash: TypedSubmitFunction<ActionData> = ({ formData }) => {
		const photos = queryClient.getQueryData<Random[]>(['unsplash-random']);

		if (!photos) {
			return;
		}

		const selectedPhoto = photos.find((photo) => photo.id === formData.get('photo'));

		if (selectedPhoto) {
			formData.set('url', selectedPhoto.urls.regular);
			formData.set('unsplashPhotoId', selectedPhoto.id);
		}

		formData.delete('photo');

		return async ({ update }) => {
			await update({ invalidateAll: false });

			attachmentsPicker?.resetSelection();
			queryClient.invalidateQueries({
				queryKey: ['items', itemId]
			});
		};
	};

	const handleRemoveCover: TypedSubmitFunction<ActionData> = () => {
		if (!cover) {
			return;
		}

		return async ({ update }) => {
			await update({ invalidateAll: false });

			queryClient.invalidateQueries({
				queryKey: ['items', itemId]
			});
		};
	};
</script>

<CardPopover title="Cover" let:trigger={triggerPopover}>
	<slot {triggerPopover} />
	<div slot="content" class="w-80 space-y-4" let:open>
		{#if cover}
			<form method="post" action="?/removeCover" use:enhance={handleRemoveCover}>
				<Button type="submit" variant="secondary" class="w-full">Remove cover</Button>
			</form>
		{/if}
		{#if attachments.length > 0}
			<form
				bind:this={makeCoverFromAttachmentFormElm}
				method="post"
				action="?/makeCover"
				use:enhance={handleMakeCoverFromAttachment}
			>
				<h6 class="text-sm font-medium leading-6 text-gray-900 mb-2">Attachments</h6>
				<PhotosPicker
					bind:this={attachmentsPicker}
					class="grid grid-cols-3 gap-2"
					photos={attachments.map((attachment) => ({
						id: attachment.id,
						thumbUrl: attachment.url,
						alt: attachment.name
					}))}
					defaultSelectedId={cover?.attachmentId}
					on:select={() => makeCoverFromAttachmentFormElm.requestSubmit()}
				/>
			</form>
		{/if}
		<form
			bind:this={makeCoverFromUnsplashFormElm}
			method="post"
			action="?/makeCoverFromUnsplash"
			use:enhance={handleMakeCoverFromUnsplash}
		>
			<UnsplashPhotosPicker
				bind:this={unsplashPhotosPicker}
				title="Photos from Unsplash"
				visible={open}
				defaultSelectedId={cover?.unsplashPhotoId}
				on:select={() => makeCoverFromUnsplashFormElm.requestSubmit()}
			/>
		</form>
	</div>
</CardPopover>
