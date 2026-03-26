<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import IconDockTop from '$lib/components/icons/icon-dock-top.svelte';
	import ItemCoverPopover from './item-cover-popover.svelte';
	import type { ItemFullPayload } from '$lib/types';

	interface Props {
		item: ItemFullPayload;
	}

	let { item }: Props = $props();
	const { id, cover, attachments } = $derived(item);
</script>

{#if cover}
	<header class="bg-gray-200">
		<img
			src={cover.url}
			alt="item cover"
			style:view-transition-name={`item_${id}_cover`}
			class="w-full h-48 object-contain rounded-lg"
		/>
		<ItemCoverPopover
			{cover}
			attachments={attachments.filter((attachment) => attachment.type.startsWith('image/'))}
			itemId={id}
		>
			{#snippet children({ targetId, action })}
				<Button
					variant="ghost"
					class="absolute top-36 right-4 flex gap-2"
					popovertarget={targetId}
					popovertargetaction={action}
					aria-label="open cover settings"
				>
					<IconDockTop />
					Cover
				</Button>
			{/snippet}
		</ItemCoverPopover>
	</header>
{/if}
