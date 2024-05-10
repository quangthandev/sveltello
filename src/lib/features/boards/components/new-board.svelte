<script lang="ts">
	import { tick } from 'svelte';
	import { applyAction, enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import UnsplashPhotosPicker from '$lib/features/unsplash/components/unsplash-photos-picker.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import type { TypedSubmitFunctionWithCallback } from '$lib/form';
	import type { Photo } from '$lib/components/shared/photos-picker/types';
	import { createBoardSchema } from '../schemas';
	import type { ActionData } from '../../../../routes/(user)/boards/$types';

	let isSubmitting = false;
	let inputInstance: Input | null = null;
	let selectedPhoto: Photo | null = null;

	const queryClient = useQueryClient();

	const handleOpen = async () => {
		await tick();
		inputInstance?.focus();
	};

	const handleSubmit: TypedSubmitFunctionWithCallback<ActionData> = (
		{ formData, cancel },
		{ onSuccess: onSuccess }
	) => {
		isSubmitting = true;

		if (selectedPhoto) {
			formData.set('imageId', selectedPhoto.id);
			formData.set('imageThumbUrl', selectedPhoto.thumbUrl);
			formData.set('imageFullUrl', selectedPhoto.fullUrl!);
			formData.set('imageUsername', selectedPhoto.username!);
			formData.set('imageLinkHtml', selectedPhoto.htmlLink!);
			formData.set(
				'imageAltDescription',
				selectedPhoto.alt || `Photo by ${selectedPhoto.username} on Unsplash`
			);
		}

		formData.delete('photo');

		const data = Object.fromEntries(formData.entries());

		// Validate the form data
		const validationResult = createBoardSchema.safeParse(data);

		if (!validationResult.success) {
			isSubmitting = false;
			console.error(validationResult.error);
			cancel();
			return;
		}

		return async ({ result }) => {
			await queryClient.invalidateQueries({ queryKey: ['boards'] });

			if (result.type === 'redirect') {
				await goto(result.location, {
					invalidateAll: true
				});

				isSubmitting = false;
				onSuccess?.();
			} else {
				applyAction(result);
			}
		};
	};

	let innerWidth = 0;

	let placement: 'right' | 'bottom' = 'right';
	$: placement = innerWidth < 640 ? 'bottom' : 'right';
</script>

<svelte:window bind:innerWidth />

<CardPopover title="Create Board" let:trigger class="w-96" on:open={handleOpen}>
	<slot {trigger} />

	<div slot="content" let:open let:close>
		<form
			class="max-w-md space-y-4"
			method="post"
			action="/boards?/create"
			use:enhance={(input) => handleSubmit(input, { onSuccess: close })}
		>
			<UnsplashPhotosPicker
				title="Background"
				visible={open}
				on:select={(event) => (selectedPhoto = event.detail)}
			/>
			<div class="flex items-center gap-1">
				<label for="new-board-color" class="text-sm font-medium"> Color </label>
				<input
					id="new-board-color"
					name="color"
					type="color"
					value="#cbd5e1"
					class="bg-transparent"
				/>
			</div>
			<div>
				<Label for="new-board-name" class="block mb-2">Board Title</Label>
				<Input id="new-board-name" name="name" type="text" required bind:this={inputInstance} />
			</div>
			<Button type="submit" class="w-full font-medium" disabled={isSubmitting}>Create</Button>
		</form>
	</div>
</CardPopover>
