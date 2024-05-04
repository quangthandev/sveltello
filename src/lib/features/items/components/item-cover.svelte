<script lang="ts">
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import IconDockTop from '$lib/components/icons/icon-dock-top.svelte';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import ImagePicker from '$lib/features/unsplash/components/image-picker.svelte';
	import type { TypedSubmitFunction } from '$lib/form';
	import type { Cover } from '$lib/types';
	import type { Random } from 'unsplash-js/dist/methods/photos/types';
	import type { ActionData } from '../../../../routes/(user)/items/[id]/$types';

	export let cover: Cover;

	let makeCoverFormElm: HTMLFormElement;

	const queryClient = useQueryClient();

	const handleMakeCover: TypedSubmitFunction<ActionData> = ({ formData }) => {
		const images = queryClient.getQueryData<Random[]>(['unsplash-random']);

		if (!images) {
			return;
		}

		const selectedImage = images.find((photo) => photo.id === formData.get('photo'));

		if (selectedImage) {
			formData.set('url', selectedImage.urls.regular);
		}

		formData.delete('photo');

		return async ({ update }) => {
			await update({ invalidateAll: false });

			queryClient.invalidateQueries({
				queryKey: ['items', cover.itemId]
			});
		};
	};

	const handleRemoveCover: TypedSubmitFunction<ActionData> = () => {
		return async ({ update }) => {
			await update({ invalidateAll: false });

			queryClient.invalidateQueries({
				queryKey: ['items', cover.itemId]
			});
		};
	};
</script>

<img src={cover.url} alt="item cover" class="w-full h-48 object-contain rounded-lg" />
<CardPopover title="Cover" let:trigger={triggerPopover}>
	<Button
		variant="ghost"
		class="absolute top-36 right-4 flex gap-2"
		builders={[{ action: triggerPopover }]}
		aria-label="open cover settings"
	>
		<IconDockTop />
		Cover
	</Button>
	<div slot="content" class="w-96" let:open>
		<form method="post" action="?/removeCover" use:enhance={handleRemoveCover}>
			<Button type="submit" variant="secondary" class="w-full">Remove cover</Button>
		</form>
		<form
			bind:this={makeCoverFormElm}
			method="post"
			action="?/makeCoverFromUnsplash"
			use:enhance={handleMakeCover}
		>
			<ImagePicker
				visible={open}
				on:select={() => {
					makeCoverFormElm.requestSubmit();
				}}
			/>
		</form>
	</div>
</CardPopover>
