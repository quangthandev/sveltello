<script lang="ts">
	import { writable } from 'svelte/store';
	import { popoverCtx } from './context';

	const { open } = popoverCtx.set({
		triggerEl: writable(null),
		open: writable(false)
	});

	const close = () => open.set(false);
</script>

<slot {close} open={$open} />
