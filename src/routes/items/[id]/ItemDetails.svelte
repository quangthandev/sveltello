<script lang="ts">
	import { page } from '$app/stores';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Column, Item } from '@prisma/client';
	import ItemDecription from './ItemDecription.svelte';
	import Skeleton from '$lib/components/Skeleton.svelte';
	import ItemHeader from './ItemHeader.svelte';
	import ItemActivity from './ItemActivity.svelte';

	export let id: string;

	const query = createQuery<Item & { column: Column }>({
		queryKey: ['items', id],
		queryFn: async () => {
			const res = await fetch(`/items/${id}`);
			return res.json();
		},
		initialData: $page.data.item
	});

	$: item = $query.data;
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
	{:else if item}
		<ItemHeader
			id={item.id}
			boardId={item.boardId.toString()}
			title={item.title}
			columnName={item.column.name}
			on:close
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
	{:else if item}
		<ItemDecription
			id={item.id.toString()}
			boardId={item.boardId.toString()}
			content={item.content}
		/>
	{/if}

	<!-- Activity -->
	{#if $query.isLoading || $query.isFetching}
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
