<script lang="ts">
	import { cn } from '$lib/utils';
	import IconChevronLeft from '$lib/components/icons/icon-chevron-left.svelte';
	import IconChevronRight from '$lib/components/icons/icon-chevron-right.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import SidebarLeftNav from './sidebar-left-nav.svelte';
	import type { Board } from '$lib/types';
	import type { Attachment } from 'svelte/attachments';

	interface Props {
		expanded: boolean;
		initialBoards: Board[];
		onToggle: (expanded: boolean) => void;
	}

	let { expanded, initialBoards, onToggle }: Props = $props();

	let btnCollapse: Button;

	function tooltip(): Attachment<HTMLDivElement> {
		return (element) => {
			const btns = document.querySelectorAll('.sidebar-left-toggler');

			const supported = Object.hasOwn(HTMLButtonElement.prototype, 'interestForElement');
			btns.forEach((btn) => {
				if (supported) {
					// @ts-expect-error
					btn.interestForElement = element;
				} else {
					// TODO
				}
			});
		};
	}
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

<Button
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
<aside
	class={cn(
		'fixed bg-slate-700 text-white z-10 w-appSidebar h-full duration-200 will-change-transform border-r-2 border-r-slate-600',
		'sidebar-left'
	)}
>
	<div class="flex justify-end px-2 py-4 border-b-2 border-b-slate-400">
		<Button
			bind:this={btnCollapse}
			variant="ghost"
			size="icon"
			class="mr-2 sidebar-left-toggler"
			onclick={() => onToggle(false)}
		>
			<IconChevronLeft />
			<span class="sr-only">Collapse Sidebar</span>
		</Button>
	</div>
	<SidebarLeftNav {initialBoards} />
	<Button
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
</aside>

<p
	popover="hint"
	class="p-2 flex gap-2 justify-center items-center bg-slate-400 rounded-lg"
	{@attach tooltip()}
>
	<span>Toggle Sidebar</span>
	<code class="grid place-content-center w-6 h-6">[</code>
</p>
