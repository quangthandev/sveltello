<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { cn } from '$lib/utils';
	import IconChevronLeft from '$lib/components/icons/icon-chevron-left.svelte';
	import IconChevronRight from '$lib/components/icons/icon-chevron-right.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import SidebarLeftToggler from './sidebar-left-toggler.svelte';
	import SidebarLeftNav from './sidebar-left-nav.svelte';

	export let expanded: boolean;
	let btnCollapse: Button;

	const dispatch = createEventDispatcher<{ toggle: boolean }>();

	// Toggle the sidebar when the "[" key is pressed...
	// ..., ignoring the event if the user is typing in an input or textarea field, ...
	// ... or if the target element or target's parent is content editable.
	onMount(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			const targetElm = event.target as HTMLElement;

			if (
				event.key === '[' &&
				!['input', 'textarea'].includes(targetElm.tagName.toLowerCase()) &&
				!targetElm.isContentEditable &&
				!targetElm.parentElement?.isContentEditable
			) {
				if (!expanded) {
					dispatch('toggle', true);
					btnCollapse.focus();
				} else {
					dispatch('toggle', false);
					if (document.activeElement instanceof HTMLElement) {
						document.activeElement.blur();
					}
				}
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<SidebarLeftToggler tooltip="Expand sidebar" let:builder>
	<Button
		variant="secondary"
		size="icon"
		class={cn(
			'fixed z-30 rounded-full translate-y-4 bg-slate-700 hover:bg-slate-500 text-white shadow-md',
			{
				hidden: expanded
			}
		)}
		aria-label="expand sidebar"
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
			'translate-x-0': expanded,
			'-translate-x-full': !expanded
		}
	)}
>
	<div class="flex justify-end px-2 py-4 border-b-2 border-b-slate-400">
		<SidebarLeftToggler tooltip="Collapse sidebar" let:builder>
			<Button
				bind:this={btnCollapse}
				variant="ghost"
				size="icon"
				class="mr-2"
				aria-label="collapse sidebar"
				builders={[builder]}
				on:click={() => dispatch('toggle', false)}
			>
				<IconChevronLeft />
			</Button>
		</SidebarLeftToggler>
	</div>
	<SidebarLeftNav />
	<SidebarLeftToggler tooltip="Expand sidebar" let:builder>
		<Button
			variant="secondary"
			size="sm"
			class={cn(
				'absolute inset-0 w-5 h-full p-0 rounded-none bg-slate-700 hover:bg-slate-500 duration-200 will-change-transform',
				{
					'-translate-x-full': expanded,
					'translate-x-[var(--app-sidebar-width)]': !expanded
				}
			)}
			tabindex={-1}
			aria-label="expand sidebar"
			builders={[builder]}
			on:click={() => dispatch('toggle', true)}
		></Button>
	</SidebarLeftToggler>
</aside>
