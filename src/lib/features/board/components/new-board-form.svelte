<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import UnsplashPhotosPicker from '$lib/features/unsplash/components/unsplash-photos-picker.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { TypedSubmitFunctionWithCallback } from '$lib/form';
	import type { Photo } from '$lib/components/shared/photos-picker/types';
	import { createBoardSchema } from '../board.schemas';
	import type { ActionData } from '../../../../routes/(user)/boards/$types';

	interface Props {
		visible?: boolean;
		onSuccess: () => void;
	}

	let { visible = true, onSuccess }: Props = $props();

	let isSubmitting = $state(false);
	let inputInstance: Input | null = $state(null);
	let selectedPhoto: Photo | null = $state(null);

	const queryClient = useQueryClient();

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

	export function focusInput() {
		inputInstance?.focus();
	}
</script>

<form
	class="max-w-md space-y-4"
	method="post"
	action="/boards?/create"
	use:enhance={(input) => handleSubmit(input, { onSuccess })}
>
	<fieldset class="space-y-2">
		<legend>Background</legend>
		<UnsplashPhotosPicker {visible} onSelect={(photo) => (selectedPhoto = photo)} />
	</fieldset>
	<div class="flex items-center gap-1">
		<label for="new-board-color" class="text-sm font-medium"> Color </label>
		<input id="new-board-color" name="color" type="color" value="#cbd5e1" class="bg-transparent" />
	</div>
	<div>
		<label for="new-board-name" class="block mb-2">Board Title</label>
		<Input id="new-board-name" name="name" type="text" required bind:this={inputInstance} />
	</div>
	<Button type="submit" class="w-full font-medium" disabled={isSubmitting}>Create</Button>
</form>
