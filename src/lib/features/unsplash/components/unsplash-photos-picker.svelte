<script lang="ts">
	import { useRandomPhotos } from '$lib/features/unsplash/query-client';
	import { cn } from '$lib/utils';
	import Skeleton from '$lib/components/ui/skeleton.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import PhotosPicker from '$lib/components/shared/photos-picker.svelte';

	export let title: string;
	export let visible = false;
	export let defaultSelectedId: string | null | undefined = undefined;

	let photosPicker: PhotosPicker;

	const query = useRandomPhotos({ enabled: visible });

	export function resetSelection() {
		photosPicker.resetSelection();
	}
</script>

<div>
	<div class="flex items-center justify-between">
		<h6 class="text-sm font-medium leading-6 text-gray-900">{title}</h6>
		<Button
			variant="ghost"
			size="icon"
			class="text-muted-foreground"
			aria-label="reload"
			on:click={() => $query.refetch()}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				width="24"
				height="24"
				fill="currentColor"
			>
				<path
					d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
				/>
			</svg>
		</Button>
	</div>
	{#if $query.isLoading || $query.isFetching}
		<div class="flex flex-col gap-2">
			<Skeleton class={cn('w-full h-16 bg-neutral-200')} />
			<Skeleton class={cn('w-full h-16 bg-neutral-200')} />
		</div>
	{:else if $query.data}
		<PhotosPicker
			bind:this={photosPicker}
			class="grid grid-cols-3 gap-2"
			photos={$query.data.map((photo) => ({
				id: photo.id,
				thumbUrl: photo.urls.thumb,
				htmlLink: photo.links.html,
				alt: photo.alt_description,
				username: photo.user.name
			}))}
			{defaultSelectedId}
			on:select
		/>
	{:else if $query.error}
		<div class={cn('flex items-center justify-center w-full h-20 text-red-600 bg-neutral-200')}>
			{$query.error.message}
		</div>
	{/if}
</div>
