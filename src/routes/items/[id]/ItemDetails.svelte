<script lang="ts">
	import { page } from '$app/stores';
	import { createQuery } from '@tanstack/svelte-query';
	import ItemDescription from './ItemDescription.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import ItemTitle from './ItemTitle.svelte';
	import ItemActivity from './ItemActivity.svelte';
	import ItemActions from './ItemActions.svelte';
	import ItemAttachments from './ItemAttachments.svelte';
	import ItemQueriesProvider from './ItemQueriesProvider.svelte';
	import type { ItemFullPayload } from '../../types';
	import IconClose from '$lib/components/icons/IconClose.svelte';
	import { createEventDispatcher } from 'svelte';

	export let id: string;

	const query = createQuery<ItemFullPayload>({
		queryKey: ['items', id],
		queryFn: async () => {
			const res = await fetch(`/items/${id}`);
			return res.json();
		},
		initialData: $page.data.item
	});

	$: item = $query.data;
	$: isLoading = $query.isLoading || $query.isFetching;

	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<ItemQueriesProvider>
	<div class="relative">
		<button
			on:click={() => {
				dispatch('close');
			}}
			class="absolute top-4 right-4 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
			aria-label="close"
		>
			<IconClose />
		</button>

		<!-- Cover -->
		{#if item?.cover}
			<header class="bg-gray-200">
				<img src={item?.cover.url} alt="item cover" class="w-full h-48 object-contain rounded-lg" />
			</header>
		{/if}
		<div class="p-6 bg-gray-100">
			<!-- Title section -->
			{#if isLoading && !item}
				<div class="flex items-start gap-x-3 mb-6">
					<Skeleton class="h-6 w-6 mt-1 bg-neutral-200" />
					<div>
						<Skeleton class="w-24 h-6 mb-1 bg-neutral-200" />
						<Skeleton class="w-12 h-4 bg-neutral-200" />
					</div>
				</div>
			{:else if item}
				<ItemTitle {item} />
			{/if}

			<div class="flex flex-col lg:flex-row gap-2">
				<div class="flex flex-col gap-8 flex-grow">
					<!-- Description section -->
					<ItemDescription {item} {isLoading} />

					<!-- Attachments -->
					{#if item && item.attachments.length > 0}
						<ItemAttachments itemId={id} attachments={item.attachments} />
					{/if}

					<!-- Activity section -->
					{#if isLoading && !item}
						<div class="flex items-start gap-x-3 w-full">
							<Skeleton class="h-6 w-6 bg-neutral-200" />
							<div class="w-full">
								<Skeleton class="w-24 h-6 mb-2 bg-neutral-200" />
								<Skeleton class="w-full h-10 bg-neutral-200" />
							</div>
						</div>
					{:else if item}
						<ItemActivity {item} />
					{/if}
				</div>

				<!-- Actions section -->
				{#if item}
					<ItemActions {item} class="min-w-48 translate-y-0 lg:-translate-y-10" />
				{/if}
			</div>
		</div>
	</div>
</ItemQueriesProvider>
