<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { popoverCtx } from './context';
	import Button from '$lib/components/ui/button/button.svelte';

	type $$Props = HTMLButtonAttributes;

	const { open } = popoverCtx.get();
</script>

<Button variant="ghost" size="icon" on:click={() => open.set(false)} {...$$restProps}>
	<slot />
</Button>
