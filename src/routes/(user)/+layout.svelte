<script lang="ts">
	import SidebarLeft from '$lib/components/sidebars/sidebar-left.svelte';
	import { sidebarPreference } from '$lib/stores/sidebar-preference';
	import { cn } from '$lib/utils';
	import { Toaster } from '$lib/components/ui/sonner';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';
	import { run } from 'svelte/legacy';
	import type { Snippet } from 'svelte';

	interface Props {
		data: LayoutData;
		children?: Snippet;
	}

	let { data, children }: Props = $props();

	function handleToggleSidebar(expanded: boolean) {
		const root = document.documentElement;

		if (expanded) {
			root.style.setProperty('--sidebar-left-transform', 'translateX(0)');
			root.style.setProperty('--main-content-padding-left', 'var(--app-sidebar-width)');
			root.style.setProperty('--sidebar-left-toggler-btn-visibility', 'hidden');
			root.style.setProperty('--sidebar-left-toggler-bar-transform', 'translateX(-100%)');
		} else {
			root.style.setProperty('--sidebar-left-transform', 'translateX(-100%)');
			root.style.setProperty('--main-content-padding-left', '1rem');
			root.style.setProperty('--sidebar-left-toggler-btn-visibility', 'visible');
			root.style.setProperty(
				'--sidebar-left-toggler-bar-transform',
				'translateX(var(--app-sidebar-width))'
			);
		}
	}
	let expanded = $derived(!!$sidebarPreference?.expanded);

	run(() => {
		if (page.form) {
			if (page.status >= 400) {
				toast.error(page.form.message);
			}
		}
	});

	run(() => {
		browser && handleToggleSidebar(expanded);
	});
</script>

<div class="flex flex-grow h-full">
	<SidebarLeft
		{expanded}
		initialBoards={data.boards}
		onToggle={(expanded) => {
			sidebarPreference.set({ expanded });
		}}
	/>
	<main class={cn('w-full h-full main-content')}>
		{@render children?.()}
	</main>
</div>

<Toaster richColors />
