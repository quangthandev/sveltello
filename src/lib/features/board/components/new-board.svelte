<script lang="ts">
	import { tick, type ComponentProps } from 'svelte';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import PopoverNative from '$lib/components/ui/popover-native.svelte';
	import NewBoardForm from './new-board-form.svelte';

	interface Props extends Pick<ComponentProps<typeof PopoverNative>, 'targetId' | 'children'> {}

	let { targetId = 'newboard', children: renderChildren }: Props = $props();

	let popover = $state<HTMLDivElement | null>(null);
	let newBoardForm = $state<ReturnType<typeof NewBoardForm> | null>(null);
</script>

<CardPopover
	asChild
	title="Create Board"
	{targetId}
	bind:node={popover}
	class="w-96"
	onToggle={async (open) => {
		if (open) {
			await tick();
			newBoardForm?.focusInput();
		}
	}}
>
	{#snippet children({ targetId, action })}
		{@render renderChildren?.({ targetId, action })}
	{/snippet}
	{#snippet content({ open })}
		<NewBoardForm
			visible={open}
			bind:this={newBoardForm}
			onSuccess={() => popover?.hidePopover()}
		/>
	{/snippet}
</CardPopover>
