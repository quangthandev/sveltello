<script lang="ts">
	import { enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import ImagePicker from '$lib/features/unsplash/components/image-picker.svelte';
	import type { TypedSubmitFunction } from '$lib/form';
	import type { Cover } from '$lib/types';
	import type { Random } from 'unsplash-js/dist/methods/photos/types';
	import type { ActionData } from '../../../../routes/(user)/items/[id]/$types';

	export let itemId: string;
	export let cover: Cover | null;

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
				queryKey: ['items', cover.itemId]
			});
		};
	};
</script>

<CardPopover title="Cover" let:trigger={triggerPopover}>
	<slot {triggerPopover} />
	<div slot="content" class="w-96" let:open>
		{#if cover}
			<form method="post" action="?/removeCover" use:enhance={handleRemoveCover}>
				<Button type="submit" variant="secondary" class="w-full">Remove cover</Button>
			</form>
		{/if}
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
