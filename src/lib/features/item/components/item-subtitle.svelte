<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import MoveOrCopyItemPopover from './move-or-copy-item-popover.svelte';
	import type { ItemFullPayload } from '$lib/types';

	interface Props {
		item: ItemFullPayload;
	}

	let { item }: Props = $props();
</script>

<div class="text-sm text-muted-foreground px-3">
	in list
	<MoveOrCopyItemPopover {item}>
		{#snippet children({ targetId })}
			<Button variant="link" popovertarget={targetId} class="p-0 underline hover:bg-transparent">
				{item.column.name}
			</Button>
		{/snippet}
	</MoveOrCopyItemPopover>
</div>
