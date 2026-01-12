<script lang="ts">
	import Portal from './portal.svelte';
	import { cn } from '$lib/utils';
	import type { HTMLDialogAttributes } from 'svelte/elements';
	import { trapFocus } from '$lib/actions/trap-focus';
	import { escapeKeydown } from '$lib/actions/escape-keydown';
	import type { Attachment } from 'svelte/attachments';

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

	function click(): Attachment<HTMLDialogElement> {
		function handleClick(event: PointerEvent) {
			if (event.target === node) {
				onDismiss();
			}
		}

		return (element) => {
			element.addEventListener('click', handleClick);

			return () => element.removeEventListener('click', handleClick);
		};
	}
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
		{@attach click()}
	>
		{@render children?.()}
	</dialog>
</Portal>
