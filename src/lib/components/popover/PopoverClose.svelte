<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { popoverCtx } from './context';

	type $$Props = HTMLButtonAttributes;

	const { open } = popoverCtx.get();
</script>

<button on:click={() => open.set(false)} {...$$restProps}>
	<slot />
</button>
