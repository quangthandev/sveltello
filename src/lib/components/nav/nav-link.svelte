<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import { buttonVariants } from '../ui/button';

	interface Props {
		href: string;
		children: Snippet;
	}

	let { href, children }: Props = $props();

	let active = $derived(page.url.pathname === href);
</script>

<li
	class={cn('rounded-md', {
		'bg-slate-500': active
	})}
>
	<a
		{href}
		class={cn(buttonVariants({ variant: 'ghost' }), 'flex items-center justify-start gap-2')}
	>
		{@render children()}
	</a>
</li>
