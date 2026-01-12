<script lang="ts">
	import { buttonVariants, type Size, type Variant } from './index';
	import { cn } from '$lib/utils';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		class?: string;
		variant?: Variant;
		size?: Size;
	}

	let {
		class: className = undefined,
		variant = 'default',
		size = 'default',
		children,
		...rest
	}: Props = $props();

	let buttonElm: HTMLButtonElement;

	function bind(node: Node) {
		buttonElm = node as HTMLButtonElement;
	}

	export function focus() {
		buttonElm.focus();
	}
</script>

<button type="button" class={cn(buttonVariants({ variant, size, className }))} use:bind {...rest}>
	{@render children?.()}
</button>
