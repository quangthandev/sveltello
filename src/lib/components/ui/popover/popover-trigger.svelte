<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { popoverCtx } from './context';
	import type { ActionReturn } from 'svelte/action';

	export let asChild = false;

	let trigger: HTMLElement;

	const { triggerEl, open } = popoverCtx.get();

	const dispatch = createEventDispatcher<{ open: void; close: void }>();

	onMount(() => {
		triggerEl.set(trigger);
	});

	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		open.update((isCurrentlyOpen) => {
			dispatch(isCurrentlyOpen ? 'close' : 'open');
			return !isCurrentlyOpen;
		});
	};

	interface TriggerActionAttributes {}

	function triggerAction(node: HTMLElement): ActionReturn<unknown, TriggerActionAttributes> {
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
