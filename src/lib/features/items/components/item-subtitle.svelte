<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import MoveOrCopyItemPopover from './move-or-copy-item-popover.svelte';
	import { getItemDetailsContext } from '../contexts/item-details.context';

	const itemDetails = getItemDetailsContext();
</script>

<p class="text-sm text-muted-foreground px-3">
	in list
	<MoveOrCopyItemPopover>
		{#snippet children({ targetId })}
			<Button variant="link" popovertarget={targetId} class="p-0 underline hover:bg-transparent">
				{$itemDetails.column.name}
			</Button>
		{/snippet}
	</MoveOrCopyItemPopover>
</p>
