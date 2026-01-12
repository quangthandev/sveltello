<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	let inputElm = $state<HTMLInputElement | null>(null);

	let {
		class: className = undefined,
		value = $bindable(undefined),
		...rest
	}: HTMLInputAttributes = $props();

	export function select() {
		inputElm?.select();
	}

	export function focus() {
		inputElm?.focus();
	}

	export function blur() {
		inputElm?.blur();
	}
</script>

<input
	class={cn(
		'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
		'file:border-0 file:bg-transparent file:text-sm file:font-medium',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		'placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	bind:value
	bind:this={inputElm}
	{...rest}
/>
