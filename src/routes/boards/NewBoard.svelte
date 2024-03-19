<script lang="ts">
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import IconClose from '$lib/components/icons/IconClose.svelte';
	import * as Popover from '$lib/components/popover';
	import { cn } from '$lib/utils';
	import { useQueryClient } from '@tanstack/svelte-query';
	import ImagePicker from './ImagePicker.svelte';
	import type { Random } from 'unsplash-js/dist/methods/photos/types';
	import type { TypedSubmitFunction } from '$lib/form';
	import type { ActionData } from './$types';

	const queryClient = useQueryClient();

	const handleSubmit: TypedSubmitFunction<ActionData> = ({ formData }) => {
		const images = queryClient.getQueryData<Random[]>(['unsplash-random']);
		const seletecImage = images?.find((photo) => photo.id === formData.get('photo'));

		if (seletecImage) {
			formData.set('imageId', seletecImage.id);
			formData.set('imageThumbUrl', seletecImage.urls.thumb);
			formData.set('imageFullUrl', seletecImage.urls.full);
			formData.set('imageUsername', seletecImage.user.username);
			formData.set('imageLinkHTML', seletecImage.links.html);
		}

		formData.delete('photo');

		return async ({ update }) => {
			await update({ invalidateAll: false });
		};
	};
</script>

<Popover.Root let:open>
	<Popover.Trigger asChild let:triggerAction={trigger}>
		<slot {trigger} />
	</Popover.Trigger>

	<Popover.Content
		floatingConfig={{ placement: 'bottom' }}
		class={cn('absolute top-0 left-0 bg-white shadow-2xl py-4 rounded-lg w-80 z-50')}
	>
		<header class="relative mb-4">
			<h3 class="font-bold text-center">Create Board</h3>
			<Popover.Close
				class="absolute -top-2 right-2 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
				aria-label="close"
			>
				<IconClose />
			</Popover.Close>
		</header>
		<form
			class="px-8 max-w-md space-y-4"
			method="post"
			action="?/create"
			use:enhance={handleSubmit}
		>
			<ImagePicker visible={open} />
			<div class="flex items-center gap-1">
				<label for="board-color" class="text-sm font-medium"> Color </label>
				<input id="board-color" name="color" type="color" value="#cbd5e1" class="bg-transparent" />
			</div>
			<div>
				<Input label="Board title" name="name" type="text" required />
			</div>
			<button
				class="w-full bg-blue-600 hover:opacity-90 text-white rounded-md py-2 px-4 font-medium disabled:bg-neutral-100 disabled:text-neutral-300 disabled:cursor-not-allowed"
			>
				Create
			</button>
		</form>
	</Popover.Content>
</Popover.Root>
