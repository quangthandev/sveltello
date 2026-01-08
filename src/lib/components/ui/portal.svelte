<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children }: HTMLAttributes<HTMLDivElement> = $props();

	let el = $state<HTMLElement | null>(null);

	onMount(() => {
		if (!el) return;

		el.ownerDocument.body.appendChild(el);
	});

	onDestroy(() => {
		if (el?.parentNode) {
			el.parentNode.removeChild(el);
		}
	});
</script>

<div bind:this={el} class="contents" hidden>
	{@render children?.()}
</div>
