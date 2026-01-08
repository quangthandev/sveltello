<script lang="ts">
	import { onMount } from 'svelte';
	import Portal from './portal.svelte';
	import { cn } from '$lib/utils';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { trapFocus } from '$lib/actions/trap-focus';
	import { escapeKeydown } from '$lib/actions/escape-keydown';

	interface Props extends HTMLDialogAttributes {
		node: HTMLDialogElement | null;
		onDismiss: () => void;
		onClose: () => void;
	}

	let {
		class: className = undefined,
		node = $bindable(),
		children,
		onDismiss,
		onClose,
		...rest
	}: Props = $props();

	onMount(() => {
		function handleClick(event: PointerEvent) {
			if (event.target === node) {
				onDismiss();
			}
		}

		if (node) {
			node.addEventListener('click', handleClick);
		}

		return () => {
			if (node) {
				node.removeEventListener('click', handleClick);
			}
		};
	});
</script>

<Portal>
	<dialog
		bind:this={node}
		class={cn(className)}
		{...rest}
		onclose={onClose}
		use:trapFocus
		use:escapeKeydown={{
			handler: onDismiss
		}}
	>
		{@render children?.()}
	</dialog>
</Portal>
