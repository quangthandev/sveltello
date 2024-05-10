<script lang="ts">
	import type { ItemFullPayload } from '$lib/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { createEventDispatcher } from 'svelte';
	import IconClose from '$lib/components/icons/icon-close.svelte';
	import IconReload from '$lib/components/icons/icon-reload.svelte';
	import Skeleton from '$lib/components/ui/skeleton.svelte';
	import { useItem } from '../query-client/queries';
	import { createItemDetailsContext } from '../contexts/item-details.context';
	import createItemDetailsStore from '../stores/item-details.store';

	export let id: string;
	export let initialData: ItemFullPayload | undefined = undefined;

	const itemQuery = useItem(id, initialData);

	const store = createItemDetailsStore();
	const context = createItemDetailsContext();

	$: if ($itemQuery.data) {
		store.set($itemQuery.data);
		context.set(store);
	}

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
	{#if $itemQuery.isLoading}
		<div class="p-6 bg-gray-100">
			<div class="flex items-start gap-x-3 mb-6">
				<Skeleton class="h-6 w-6 mt-1 bg-neutral-200" />
				<div>
					<Skeleton class="w-24 h-6 mb-1 bg-neutral-200" />
					<Skeleton class="w-12 h-4 bg-neutral-200" />
				</div>
			</div>

			<div class="flex flex-col lg:flex-row gap-2">
				<div class="flex flex-col gap-8 flex-grow">
					<div class="grid grid-cols-item-section items-start w-full">
						<Skeleton class="h-6 w-6 bg-neutral-200" />
						<div class="px-2 w-full space-y-2">
							<Skeleton class="h-6 w-24 mb-1 bg-neutral-200" />
							<div class="min-h-[60px] font-medium rounded-md item-description py-2">
								<Skeleton class="w-full h-[78px] bg-neutral-200" />
							</div>
						</div>
					</div>

					<div class="flex items-start gap-x-3 w-full">
						<Skeleton class="h-6 w-6 bg-neutral-200" />
						<div class="w-full">
							<Skeleton class="w-24 h-6 mb-2 bg-neutral-200" />
							<Skeleton class="w-full h-10 bg-neutral-200" />
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else if $itemQuery.isError}
		<div class="p-6 min-h-60 grid place-content-center">
			<p class="text-destructive mb-4">{$itemQuery.error.message}</p>
			<Button variant="outline" class="flex gap-2" on:click={() => $itemQuery.refetch()}>
				<IconReload />
				Reload
			</Button>
		</div>
	{:else}
		<slot />
	{/if}
</div>
