<script lang="ts">
	import { writable } from 'svelte/store';
	import { popoverCtx } from './context';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ close: void }>();

	const { open } = popoverCtx.set({
		triggerEl: writable(null),
		open: writable(false)
	});

	/**
	 * Close the popover
	 */
	function close() {
		open.set(false);
		dispatch('close');
	}
</script>

<slot {close} open={$open} />
