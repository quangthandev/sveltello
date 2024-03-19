<script lang="ts">
	import Skeleton from '$lib/components/Skeleton.svelte';
	import { cn } from '$lib/utils';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Random } from 'unsplash-js/dist/methods/photos/types';

	export let visible = false;

	const query = createQuery<Random[]>({
		queryKey: ['unsplash-random'],
		queryFn: async () => {
			const res = await fetch('/api/unsplash');
			return res.json();
		},
		enabled: visible,
		staleTime: Infinity // store the data indefinitely until users manually refetch
	});

	let selectedImageId: string;
</script>

<div>
	<h6 class="text-sm font-medium leading-6 text-gray-900 mb-1">Background</h6>
	{#if $query.isLoading || $query.isFetching || !$query.data}
		<Skeleton class={cn('w-full h-20 bg-neutral-200')} />
	{:else if $query.data}
		<div class="grid grid-cols-3 gap-2">
			{#each $query.data as photo (photo.id)}
				<div class="relative w-full group">
					<img
						src={photo.urls.thumb}
						alt={photo.alt_description}
						class="object-cover aspect-video rounded-md"
					/>
					<label class="absolute inset-0 w-full h-full cursor-pointer">
						<input
							type="radio"
							name="photo"
							id="photo"
							class="opacity-0"
							value={photo.id}
							bind:group={selectedImageId}
						/>
					</label>
					<a
						href={photo.links.html}
						target="_blank"
						class="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white text-center hover:underline p-1 bg-black/50"
					>
						{photo.user.name}
					</a>
					{#if selectedImageId === photo.id}
						<div
							class="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 text-white"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								width="24"
								height="24"
								fill="currentColor"
							>
								<title>check</title>
								<path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
							</svg>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
