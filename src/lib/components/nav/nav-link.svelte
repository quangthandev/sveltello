<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';

	export let href: string;

	$: active = $page.url.pathname === href;
</script>

<li
	class={cn({
		'bg-slate-500': active
	})}
>
	<Button variant="ghost" {href} class="flex justify-start gap-2">
		<slot />
	</Button>
</li>
