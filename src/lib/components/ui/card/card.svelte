<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		class: className = undefined,
		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)} {...rest}>
	{@render children?.()}
</div>
