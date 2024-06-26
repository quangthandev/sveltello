<script lang="ts">
	import SidebarLeft from '$lib/components/sidebars/sidebar-left.svelte';
	import { sidebarPreference } from '$lib/stores/sidebar-preference';
	import { cn } from '$lib/utils';
	import { Toaster } from '$lib/components/ui/sonner';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';

	$: expanded = $sidebarPreference.expanded;

	$: if ($page.form) {
		if ($page.status >= 400) {
			toast.error($page.form.message);
		}
	}

	$: browser && handleToggleSidebar(expanded);

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
</script>

<div class="flex flex-grow h-full">
	<SidebarLeft
		{expanded}
		on:toggle={(event) => {
			sidebarPreference.set({ expanded: event.detail });
		}}
	/>
	<main class={cn('w-full h-full main-content')}>
		<slot />
	</main>
</div>

<Toaster richColors />
