<script lang="ts">
	import { cn } from '$lib/utils';
	import IconChevronLeft from '$lib/components/icons/icon-chevron-left.svelte';
	import IconChevronRight from '$lib/components/icons/icon-chevron-right.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import SidebarLeftNav from './sidebar-left-nav.svelte';
	import type { Board } from '$lib/types';
	import Tooltip from '../ui/tooltip.svelte';

	interface Props {
		expanded: boolean;
		initialBoards: Board[];
		onToggle: (expanded: boolean) => void;
	}

	let { expanded, initialBoards, onToggle }: Props = $props();

	let btnCollapse: Button;
</script>

<!-- Toggle the sidebar when the "[" key is pressed... -->
<!-- ..., ignoring the event if the user is typing in an input or textarea field, ... -->
<!-- ... or if the target element or target's parent is content editable. -->
<svelte:window
	onkeydown={(event) => {
		const targetElm = event.target as HTMLElement;

		if (
			event.key === '[' &&
			!['input', 'textarea'].includes(targetElm.tagName.toLowerCase()) &&
			!targetElm.isContentEditable &&
			!targetElm.parentElement?.isContentEditable
		) {
			if (!expanded) {
				onToggle(true);
				btnCollapse.focus();
			} else {
				onToggle(false);
				if (document.activeElement instanceof HTMLElement) {
					document.activeElement.blur();
				}
			}
		}
	}}
/>

<Tooltip targetId="sidebar-toggler-tooltip-1" class="p-2 bg-slate-400 rounded-lg">
	{#snippet children({ targetId })}
		<Button
			popovertarget={targetId}
			variant="secondary"
			size="icon"
			class={cn(
				'fixed z-30 rounded-full translate-y-4 bg-slate-700 hover:bg-slate-500 text-white shadow-md',
				'sidebar-left-toggler sidebar-left-toggler-btn'
			)}
			onclick={() => onToggle(true)}
		>
			<IconChevronRight />
			<span class="sr-only">Expand Sidebar</span>
		</Button>
	{/snippet}
	{#snippet content()}
		{@render tooltipContent('Expand')}
	{/snippet}
</Tooltip>
<aside
	class={cn(
		'fixed bg-slate-700 text-white z-10 w-appSidebar h-full duration-200 will-change-transform border-r-2 border-r-slate-600',
		'sidebar-left'
	)}
	data-state={expanded ? 'expanded' : 'collapsed'}
>
	<div class="flex justify-end px-2 py-4 border-b-2 border-b-slate-400">
		<Tooltip targetId="sidebar-toggler-tooltip-2" class="p-2 bg-slate-400 rounded-lg">
			{#snippet children({ targetId })}
				<Button
					bind:this={btnCollapse}
					popovertarget={targetId}
					variant="ghost"
					size="icon"
					class="mr-2 sidebar-left-toggler"
					onclick={() => onToggle(false)}
				>
					<IconChevronLeft />
					<span class="sr-only">Collapse Sidebar</span>
				</Button>
			{/snippet}
			{#snippet content()}
				{@render tooltipContent('Collapse')}
			{/snippet}
		</Tooltip>
	</div>
	<SidebarLeftNav {initialBoards} />
	<Tooltip targetId="sidebar-toggler-tooltip-3" class="p-2 bg-slate-400 rounded-lg">
		{#snippet children({ targetId })}
			<Button
				popovertarget={targetId}
				variant="secondary"
				size="sm"
				class={cn(
					'absolute inset-0 w-5 h-full p-0 rounded-none bg-slate-700 hover:bg-slate-500 duration-200 will-change-transform',
					'sidebar-left-toggler sidebar-left-toggler-bar'
				)}
				tabindex={-1}
				onclick={() => onToggle(true)}
			>
				<span class="sr-only">Expand Sidebar</span>
			</Button>
		{/snippet}
		{#snippet content()}
			{@render tooltipContent('Expand')}
		{/snippet}
	</Tooltip>
</aside>

{#snippet tooltipContent(action: 'Expand' | 'Collapse')}
	<p class="flex gap-2">
		<span>{action} Sidebar</span>
		<code class="grid place-content-center w-6 h-6">[</code>
	</p>
{/snippet}
