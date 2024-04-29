<script lang="ts">
	import SidebarLeft from '$lib/components/sidebars/sidebar-left.svelte';
	import { cn } from '$lib/utils';

	let open = true;
</script>

<div class="flex flex-grow h-full">
	<SidebarLeft
		{open}
		on:toggle={(event) => {
			open = event.detail;
		}}
	/>
	<main
		class={cn('w-full h-full', {
			'pl-[var(--app-sidebar-width)]': open,
			'pl-4': !open
		})}
	>
		<slot />
	</main>
</div>
