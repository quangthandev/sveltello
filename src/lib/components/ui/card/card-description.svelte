<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		class: className = undefined,
		children,
		...rest
	}: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p class={cn('text-sm text-muted-foreground', className)} {...rest}>
	{@render children?.()}
</p>
