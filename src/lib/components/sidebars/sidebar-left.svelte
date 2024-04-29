<script lang="ts">
	import IconChevronLeft from '$lib/components/icons/icon-chevron-left.svelte';
	import IconChevronRight from '$lib/components/icons/icon-chevron-right.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { createEventDispatcher } from 'svelte';
	import SidebarLeftToggler from './sidebar-left-toggler.svelte';
	import SidebarLeftNav from './sidebar-left-nav.svelte';

	export let open = true;

	const dispatch = createEventDispatcher<{ toggle: boolean }>();
</script>

<SidebarLeftToggler content="Expand sidebar" let:builder>
	<Button
		variant="secondary"
		size="icon"
		class={cn(
			'fixed z-30 rounded-full translate-y-4 bg-slate-700 hover:bg-slate-500 text-white shadow-md',
			{
				hidden: open
			}
		)}
		aria-label="open sidebar"
		builders={[builder]}
		on:click={() => dispatch('toggle', true)}
	>
		<IconChevronRight />
	</Button>
</SidebarLeftToggler>
<aside
	class={cn(
		'fixed bg-slate-700 text-white z-10 w-appSidebar h-full duration-200 will-change-transform border-r-2 border-r-slate-600',
		{
			'translate-x-0': open,
			'-translate-x-full': !open
		}
	)}
>
	<div class="flex justify-end px-2 py-4 border-b-2 border-b-slate-400">
		<SidebarLeftToggler content="Collapse sidebar" let:builder>
			<Button
				variant="ghost"
				size="icon"
				class="mr-2"
				aria-label="close sidebar"
				builders={[builder]}
				on:click={() => dispatch('toggle', false)}
			>
				<IconChevronLeft />
			</Button>
		</SidebarLeftToggler>
	</div>
	<SidebarLeftNav />
	<SidebarLeftToggler content="Expand sidebar" let:builder>
		<Button
			variant="secondary"
			size="sm"
			class={cn(
				'absolute inset-0 w-5 h-full p-0 rounded-none bg-slate-700 hover:bg-slate-500 duration-200 will-change-transform',
				{
					'opacity-0': open,
					'opacity-100 translate-x-[var(--app-sidebar-width)]': !open
				}
			)}
			aria-label="open sidebar"
			builders={[builder]}
			on:click={() => dispatch('toggle', true)}
		></Button>
	</SidebarLeftToggler>
</aside>
