<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import ImagePicker from '$lib/features/unsplash/components/image-picker.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import type { Random } from 'unsplash-js/dist/methods/photos/types';
	import type { TypedSubmitFunctionWithCallback } from '$lib/form';
	import { createBoardSchema } from '../schemas';
	import type { ActionData } from '../../../../routes/(user)/boards/$types';

	let isSubmitting = false;

	const queryClient = useQueryClient();

	const handleSubmit: TypedSubmitFunctionWithCallback<ActionData> = (
		{ formData, cancel },
		onSuccess
	) => {
		isSubmitting = true;

		const images = queryClient.getQueryData<Random[]>(['unsplash-random']);
		const selectedImage = images?.find((photo) => photo.id === formData.get('photo'));

		if (selectedImage) {
			formData.set('imageId', selectedImage.id);
			formData.set('imageThumbUrl', selectedImage.urls.thumb);
			formData.set('imageFullUrl', selectedImage.urls.full);
			formData.set('imageUsername', selectedImage.user.username);
			formData.set('imageLinkHtml', selectedImage.links.html);
			formData.set(
				'imageAltDescription',
				selectedImage.alt_description || `Photo by ${selectedImage.user.name} on Unsplash`
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
				onSuccess();
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

<CardPopover title="Create Board" let:trigger class="w-96">
	<slot {trigger} />

	<div slot="content" let:open let:close>
		<form
			class="max-w-md space-y-4"
			method="post"
			action="/boards?/create"
			use:enhance={(input) => handleSubmit(input, close)}
		>
			<ImagePicker visible={open} />
			<div class="flex items-center gap-1">
				<label for="board-color" class="text-sm font-medium"> Color </label>
				<input id="board-color" name="color" type="color" value="#cbd5e1" class="bg-transparent" />
			</div>
			<div>
				<Label for="name">Board Title</Label>
				<Input id="name" name="name" type="text" required />
			</div>
			<Button type="submit" class="w-full font-medium" disabled={isSubmitting}>Create</Button>
		</form>
	</div>
</CardPopover>
