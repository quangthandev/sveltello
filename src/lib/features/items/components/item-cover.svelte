<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import IconDockTop from '$lib/components/icons/icon-dock-top.svelte';
	import ItemCoverPopover from './item-cover-popover.svelte';
	import { getItemDetailsContext } from '../contexts/item-details.context';

	const itemDetails = getItemDetailsContext();
</script>

{#if $itemDetails.cover}
	<header class="bg-gray-200">
		<img
			src={$itemDetails.cover.url}
			alt="item cover"
			class="w-full h-48 object-contain rounded-lg"
		/>
		<ItemCoverPopover
			cover={$itemDetails.cover}
			attachments={$itemDetails.attachments.filter((attachment) =>
				attachment.type.startsWith('image/')
			)}
			itemId={$itemDetails.id}
			let:triggerPopover
		>
			<Button
				variant="ghost"
				class="absolute top-36 right-4 flex gap-2"
				builders={[{ action: triggerPopover }]}
				aria-label="open cover settings"
			>
				<IconDockTop />
				Cover
			</Button>
		</ItemCoverPopover>
	</header>
{/if}
