<script lang="ts">
	import { page } from '$app/stores';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Column, Item } from '@prisma/client';
	import ItemDecription from './ItemDecription.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import ItemHeader from './ItemHeader.svelte';

	export let id: string;

	const query = createQuery<Item & { column: Column }>({
		queryKey: ['items', id],
		queryFn: async () => {
			const res = await fetch(`/items/${id}`);
			return res.json();
		},
		initialData: $page.data.item
	});
</script>

<div class="p-6">
	<!-- Header -->
	{#if $query.isLoading || $query.isFetching}
		<div class="flex items-start gap-x-3 mb-6">
			<Skeleton class="h-6 w-6 mt-1 bg-neutral-200" />
			<div>
				<Skeleton class="w-24 h-6 mb-1 bg-neutral-200" />
				<Skeleton class="w-12 h-4 bg-neutral-200" />
			</div>
		</div>
	{:else}
		<ItemHeader
			id={$query.data?.id.toString() || ''}
			boardId={$query.data?.boardId.toString() || ''}
			title={$query.data?.title || ''}
			columnName={$query.data?.column.name || ''}
		/>
	{/if}

	<!-- Description -->
	{#if $query.isLoading || $query.isFetching}
		<div class="flex items-start gap-x-3 w-full">
			<Skeleton class="h-6 w-6 bg-neutral-200" />
			<div class="w-full">
				<Skeleton class="w-24 h-6 mb-2 bg-neutral-200" />
				<Skeleton class="w-full h-[78px] bg-neutral-200" />
			</div>
		</div>
	{:else}
		<ItemDecription
			id={$query.data?.id.toString() || ''}
			boardId={$query.data?.boardId.toString() || ''}
			content={$query.data?.content || ''}
		/>
	{/if}

	<!-- Activity -->
	<div class="flex items-start gap-x-2 w-full">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="h-5 w-5 mt-0.5 text-neutral-700"
		>
			<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
		</svg>
		<div class="px-2 w-full">
			<h3 class="text-xl font-medium mb-4">Activity</h3>
		</div>
	</div>
</div>
