<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Photo {
		id: string;
		thumbUrl: string;
		htmlLink?: string;
		alt: string | null;
		username?: string;
	}
	export let photos: Photo[];
	let className: string | undefined = undefined;
	export { className as class };
	export let defaultSelectedId: string | null | undefined = undefined;

	let selectedImageId = defaultSelectedId ?? '';

	const dispatch = createEventDispatcher<{ select: Photo }>();

	export function resetSelection() {
		selectedImageId = '';
	}
</script>

<div class={className}>
	{#each photos as photo (photo.id)}
		<div
			class="relative w-full h-16 group rounded-md focus-within:outline focus-within:outline-primary"
		>
			<img
				src={photo.thumbUrl}
				alt={photo.alt}
				class="object-cover aspect-video h-full rounded-md"
			/>
			<label class="absolute inset-0 w-full h-full cursor-pointer">
				<input
					type="radio"
					name="photo"
					id="photo"
					class="opacity-0"
					value={photo.id}
					bind:group={selectedImageId}
					on:change={() => dispatch('select', photo)}
				/>
			</label>
			{#if photo.htmlLink && photo.username}
				<a
					href={photo.htmlLink}
					target="_blank"
					class="opacity-0 focus:opacity-100 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white text-center hover:underline p-1 bg-black/50"
				>
					{photo.username}
				</a>
			{/if}
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
