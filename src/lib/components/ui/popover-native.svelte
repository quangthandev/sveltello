<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { type Attachment } from 'svelte/attachments';

	type PopoverTargetAction = HTMLButtonAttributes['popovertargetaction'];
	type PopoverType = HTMLButtonAttributes['popover'];

	interface Props<TTargetId extends string = string> {
		asChild?: boolean;
		targetId?: TTargetId;
		popoverType?: PopoverType;
		node?: HTMLDivElement | null;
		action?: PopoverTargetAction;
		class?: string | undefined;
		children?: Snippet<[{ targetId: TTargetId; action: PopoverTargetAction }]>;
		content?: Snippet<[{ open: boolean }]>;
		onToggle?: (open: boolean) => void;
	}

	let {
		asChild = false,
		targetId = Math.random().toString(36).substring(2),
		popoverType = 'auto',
		node = $bindable(),
		action = 'toggle',
		class: className = '',
		children,
		content,
		onToggle,
		...rest
	}: Props = $props();

	let open = $state(false);

	function toggle(): Attachment<HTMLDivElement> {
		function handleToggle(event: ToggleEvent) {
			open = event.newState === 'open';
			onToggle?.(open);
		}

		return (element) => {
			element.addEventListener('toggle', handleToggle);

			return () => element.removeEventListener('toggle', handleToggle);
		};
	}
</script>

{#if asChild}
	{@render children?.({ targetId, action })}
{:else}
	<button type="button" {...rest} popovertarget={targetId} popovertargetaction={action}>
		{@render children?.({ targetId, action })}
	</button>
{/if}

<div
	id={targetId}
	popover={popoverType}
	bind:this={node}
	class={className}
	{@attach toggle()}
	{...rest}
>
	{@render content?.({ open })}
</div>
