<script lang="ts">
	import { useUnsplashPhoto, useUnsplashRandomPhotos } from '$lib/features/unsplash/query-client';
	import { cn } from '$lib/utils';
	import Skeleton from '$lib/components/ui/skeleton.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import PhotosPicker from '$lib/components/shared/photos-picker/photos-picker.svelte';
	import { RANDOM_PHOTOS_COUNT } from '../constants';
	import type { Random } from 'unsplash-js/dist/methods/photos/types';
	import IconReload from '$lib/components/icons/icon-reload.svelte';

	export let title: string;
	export let visible = false;
	export let defaultSelectedId: string | null | undefined = undefined;
	export let count = RANDOM_PHOTOS_COUNT;

	let photosPicker: PhotosPicker;

	const randomPhotosQuery = useUnsplashRandomPhotos({
		enabled: visible,
		count
	});

	const defaultPhotoQuery = useUnsplashPhoto(defaultSelectedId, {
		// Only fetch when the default selected ID is provided...
		// ... and it's not already in the random photos cache
		enabled:
			visible &&
			!!defaultSelectedId &&
			$randomPhotosQuery.data?.findIndex((photo) => photo.id === defaultSelectedId) === -1
	});

	$: isLoading =
		$randomPhotosQuery.isLoading ||
		$randomPhotosQuery.isFetching ||
		$defaultPhotoQuery.isLoading ||
		$defaultPhotoQuery.isFetching;

	let randomPhotos: Random[] | undefined;
	$: {
		randomPhotos = $randomPhotosQuery.data;

		if ($defaultPhotoQuery.data) {
			const defaultPhoto = $defaultPhotoQuery.data;
			randomPhotos = randomPhotos?.filter((photo) => photo.id !== defaultPhoto.id);
			randomPhotos?.unshift(defaultPhoto);
		}
	}

	$: photos = randomPhotos?.slice(0, count).map((photo) => ({
		id: photo.id,
		thumbUrl: photo.urls.regular,
		htmlLink: photo.links.html,
		alt: photo.alt_description,
		username: photo.user.name
	}));

	export function resetSelection() {
		photosPicker.resetSelection();
	}
</script>

<div>
	<div class="flex items-center justify-between">
		<h6 class="text-sm font-medium leading-6 text-gray-900">{title}</h6>
	</div>
	{#if isLoading}
		<div class="grid grid-cols-3 gap-2">
			{#each Array.from({ length: count }) as _}
				<Skeleton class={cn('w-full h-16 rounded-md bg-secondary')} />
			{/each}
		</div>
	{:else if photos}
		<PhotosPicker
			bind:this={photosPicker}
			class="grid grid-cols-3 gap-2"
			{photos}
			{defaultSelectedId}
			on:select
		/>
	{:else if $randomPhotosQuery.error}
		<div class={cn('flex flex-col items-center justify-center w-full h-32 bg-neutral-200')}>
			<p class="text-red-600">
				{$randomPhotosQuery.error.message}
			</p>
			<Button
				variant="ghost"
				size="icon"
				class="text-muted-foreground"
				aria-label="reload"
				on:click={() => $randomPhotosQuery.refetch()}
			>
				<IconReload />
			</Button>
		</div>
	{/if}
</div>
