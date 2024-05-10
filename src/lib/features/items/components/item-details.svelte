<script lang="ts">
	import ItemTitle from './item-title.svelte';
	import ItemDescription from './item-description.svelte';
	import ItemActivity from './item-activity.svelte';
	import ItemActions from './item-actions.svelte';
	import ItemAttachments from './item-attachments.svelte';
	import type { PageData } from '../../../../routes/(user)/items/[id]/$types';
	import ItemDetailsProvider from './item-details-provider.svelte';
	import ItemCover from './item-cover.svelte';

	export let id: string;
	export let data: PageData | undefined = undefined;
</script>

<ItemDetailsProvider {id} initialData={data?.item} on:close>
	<ItemCover />
	<div class="p-6 bg-gray-100">
		<ItemTitle />
		<div class="flex flex-col lg:flex-row gap-2">
			<div class="flex flex-col gap-8 flex-grow">
				<ItemDescription />
				<ItemAttachments />
				<ItemActivity />
			</div>
			<ItemActions class="min-w-48 translate-y-0 lg:-translate-y-10" />
		</div>
	</div>
</ItemDetailsProvider>
