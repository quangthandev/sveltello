<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Portal from './portal.svelte';
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import { trapFocus } from '$lib/actions/trap-focus';
	import { escapeKeydown } from '$lib/actions/escape-keydown';

	type $$Props = HTMLAttributes<HTMLDialogElement> & { node: HTMLDialogElement };

	let className: $$Props['class'] = undefined;
	export { className as class };

	export let node: HTMLDialogElement;

	const dispatch = createEventDispatcher<{
		close: void;
		dismiss: void;
	}>();

	onMount(() => {
		function handleClick(event: PointerEvent) {
			if (event.target === node) {
				dispatch('dismiss');
			}
		}

		node.addEventListener('click', handleClick);

		return () => node.removeEventListener('click', handleClick);
	});
</script>

<Portal>
	<dialog
		bind:this={node}
		class={cn(className)}
		{...$$restProps}
		on:close={() => dispatch('close')}
		use:trapFocus
		use:escapeKeydown={{
			handler: () => dispatch('dismiss')
		}}
	>
		<slot />
	</dialog>
</Portal>
