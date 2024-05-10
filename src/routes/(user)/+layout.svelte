<script lang="ts">
	import { browser } from '$app/environment';
	import SidebarLeft from '$lib/components/sidebars/sidebar-left.svelte';
	import { sidebarPreference } from '$lib/stores/sidebar-preference';
	import { cn } from '$lib/utils';
	import { Toaster } from '$lib/components/ui/sonner';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';

	$: expanded = $sidebarPreference.expanded;

	$: if ($page.form) {
		if ($page.status >= 400) {
			toast.error($page.form.message);
		}
	}
</script>

{#if browser}
	<div class="flex flex-grow h-full">
		<SidebarLeft
			{expanded}
			on:toggle={(event) => {
				sidebarPreference.set({ expanded: event.detail });
			}}
		/>
		<main
			class={cn('w-full h-full', {
				'pl-[var(--app-sidebar-width)]': expanded,
				'pl-4': !expanded
			})}
		>
			<slot />
		</main>
	</div>
{/if}

<Toaster richColors />
