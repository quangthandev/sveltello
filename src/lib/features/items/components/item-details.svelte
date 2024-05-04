<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { page } from '$app/stores';
	import Skeleton from '$lib/components/ui/skeleton.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import IconClose from '$lib/components/icons/icon-close.svelte';
	import ItemTitle from './item-title.svelte';
	import ItemDescription from './item-description.svelte';
	import ItemActivity from './item-activity.svelte';
	import ItemActions from './item-actions.svelte';
	import ItemAttachments from './item-attachments.svelte';
	import { useItem } from '../query-client/queries';
	import ItemCover from './item-cover.svelte';

	export let id: string;

	const query = useItem(id, $page.data.item);

	$: item = $query.data;
	$: isLoading = $query.isLoading || $query.isFetching;

	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<div class="relative">
	<Button
		variant="ghost"
		size="icon"
		on:click={() => {
			dispatch('close');
		}}
		class="absolute top-4 right-4 text-muted-foreground"
		aria-label="close"
	>
		<IconClose />
	</Button>

	<!-- Cover -->
	{#if item && item.cover}
		<header class="bg-gray-200">
			<ItemCover cover={item.cover} />
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
				{#if item && item.attachments?.length > 0}
					<ItemAttachments itemId={id} boardId={item.boardId} attachments={item.attachments} />
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
