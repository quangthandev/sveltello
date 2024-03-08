<script lang="ts">
	import { onMount } from 'svelte';
	import { popoverCtx } from './context';
	import type { ActionReturn } from 'svelte/action';

	export let asChild = false;

	let trigger: HTMLButtonElement;

	const { triggerEl, open } = popoverCtx.get();

	onMount(() => {
		triggerEl.set(trigger);
	});

	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		open.update((s) => !s);
	};

	interface TriggerActionAttributes {}

	function triggerAction(node: HTMLButtonElement): ActionReturn<unknown, TriggerActionAttributes> {
		trigger = node;

		node.addEventListener('click', handleClick);

		return {
			destroy() {
				node.removeEventListener('click', handleClick);
			}
		};
	}
</script>

{#if asChild}
	<slot {triggerAction} />
{:else}
	<button bind:this={trigger} on:click={handleClick} {...$$restProps}>
		<slot {triggerAction} />
	</button>
{/if}
