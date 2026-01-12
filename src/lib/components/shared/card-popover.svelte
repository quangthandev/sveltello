<script lang="ts">
	import PopoverNative from '../ui/popover-native.svelte';
	import { cn } from '$lib/utils';
	import IconClose from '$lib/components/icons/icon-close.svelte';
	import type { ComponentProps } from 'svelte';
	import Button from '../ui/button/button.svelte';

	interface Props extends ComponentProps<typeof PopoverNative> {
		title: string;
	}

	let {
		targetId,
		node = $bindable(),
		class: className = '',
		title,
		children: renderChidren,
		content: renderContent,
		onToggle
	}: Props = $props();
</script>

<PopoverNative
	asChild
	bind:node
	{targetId}
	{onToggle}
	class={cn('space-y-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm', className)}
>
	{#snippet children({ targetId, action })}
		{@render renderChidren?.({ targetId, action })}
	{/snippet}
	{#snippet content({ open })}
		<div>
			<h3 class="font-bold text-center">{title}</h3>
			<Button
				variant="ghost"
				size="icon"
				popovertarget={targetId}
				popovertargetaction="hide"
				class="absolute top-2 right-4"
			>
				<IconClose />
				<span class="sr-only">Close</span>
			</Button>
		</div>
		{@render renderContent?.({ open })}
	{/snippet}
</PopoverNative>
