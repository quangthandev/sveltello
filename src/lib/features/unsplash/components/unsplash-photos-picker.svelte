<script lang="ts">
	import { useUnsplashPhoto, useUnsplashRandomPhotos } from '$lib/features/unsplash/query-client';
	import { cn } from '$lib/utils';
	import Skeleton from '$lib/components/ui/skeleton.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import PhotosPicker from '$lib/components/shared/photos-picker/photos-picker.svelte';
	import IconReload from '$lib/components/icons/icon-reload.svelte';
	import type { Random } from 'unsplash-js/dist/methods/photos/types';
	import type { Photo } from '$lib/components/shared/photos-picker/types';
	import { RANDOM_PHOTOS_COUNT } from '../constants';
	import { run } from 'svelte/legacy';

	interface Props {
		visible?: boolean;
		defaultSelectedId?: string | null | undefined;
		count?: any;
		onSelect: (photo: Photo) => void;
	}

	let {
		visible = false,
		defaultSelectedId = undefined,
		count = RANDOM_PHOTOS_COUNT,
		onSelect
	}: Props = $props();

	let photosPicker = $state<ReturnType<typeof PhotosPicker> | null>(null);

	const randomPhotosQuery = $derived(
		useUnsplashRandomPhotos({
			enabled: visible,
			count
		})
	);

	const defaultPhotoQuery = $derived(
		useUnsplashPhoto(defaultSelectedId, {
			// Only fetch when the default selected ID is provided...
			// ... and it's not already in the random photos cache
			enabled:
				!!defaultSelectedId &&
				$randomPhotosQuery.data?.findIndex((photo) => photo.id === defaultSelectedId) === -1
		})
	);

	let isLoading = $derived(
		$randomPhotosQuery.isLoading ||
			$randomPhotosQuery.isFetching ||
			$defaultPhotoQuery.isLoading ||
			$defaultPhotoQuery.isFetching
	);

	let randomPhotos: Random[] | undefined = $state();

	run(() => {
		randomPhotos = $randomPhotosQuery.data;

		if ($defaultPhotoQuery.data) {
			const defaultPhoto = $defaultPhotoQuery.data;
			randomPhotos = randomPhotos?.filter((photo) => photo.id !== defaultPhoto.id);
			randomPhotos?.unshift(defaultPhoto);
		}
	});

	let photos: Photo[] | undefined = $derived(
		randomPhotos?.slice(0, count).map((photo) => ({
			id: photo.id,
			fullUrl: photo.urls.full,
			thumbUrl: photo.urls.regular,
			htmlLink: photo.links.html,
			alt: photo.alt_description,
			username: photo.user.name
		}))
	);

	export function resetSelection() {
		photosPicker?.resetSelection();
	}
</script>

{#if isLoading}
	<div class="grid grid-cols-3 gap-2">
		{#each Array.from({ length: count }) as _}
			<Skeleton class={cn('w-full aspect-video h-16 rounded-md bg-secondary')} />
		{/each}
	</div>
{:else if photos}
	<PhotosPicker
		bind:this={photosPicker}
		class="grid grid-cols-3 gap-2"
		{photos}
		{defaultSelectedId}
		{onSelect}
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
			onclick={() => $randomPhotosQuery.refetch()}
		>
			<IconReload />
		</Button>
	</div>
{/if}
