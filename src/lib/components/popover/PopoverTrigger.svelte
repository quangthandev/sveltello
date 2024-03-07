<script lang="ts">
	import { onMount } from 'svelte';
	import { popoverCtx } from './context';

	let trigger: HTMLButtonElement;

	const { triggerEl, open } = popoverCtx.get();

	onMount(() => {
		triggerEl.set(trigger);
	});
</script>

<button
	bind:this={trigger}
	on:click={(e) => {
		e.stopPropagation();
		e.preventDefault();
		open.update((s) => !s);
	}}
	{...$$restProps}
>
	<slot />
</button>
