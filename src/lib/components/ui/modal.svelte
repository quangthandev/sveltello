<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Portal from './portal.svelte';
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import { trapFocus } from '$lib/actions/trap-focus';

	type $$Props = HTMLAttributes<HTMLDialogElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };

	let modalEl: HTMLDialogElement;

	const dispatch = createEventDispatcher<{ close: void }>();

	onMount(() => {
		function handleClose() {
			dispatch('close');
		}

		// TODO: currently there will be error when directly adding `closedby` attribute on dialog element
		modalEl.setAttribute('closedBy', 'any');

		modalEl.addEventListener('close', handleClose);

		return () => modalEl.removeEventListener('close', handleClose);
	});
</script>

<Portal>
	<dialog bind:this={modalEl} class={cn(className)} {...$$restProps} use:trapFocus>
		<slot />
	</dialog>
</Portal>
