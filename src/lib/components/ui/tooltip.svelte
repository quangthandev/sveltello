<script lang="ts">
	import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import type { ComponentProps } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { on } from 'svelte/events';
	import PopoverNative from './popover-native.svelte';

	interface Props extends ComponentProps<typeof PopoverNative> {
		delayMs?: number;
	}

	let {
		targetId,
		class: className = '',
		children: renderChidren,
		content: renderContent,
		delayMs = 500
	}: Props = $props();

	let timeout = $state<NodeJS.Timeout>();

	function compute(anchorEl: Element, floatingEl: HTMLElement) {
		return autoUpdate(anchorEl, floatingEl, () => {
			const middleware = [offset()];
			middleware.push(flip());
			middleware.push(shift());

			computePosition(anchorEl, floatingEl, {
				placement: 'bottom-start',
				middleware
			}).then(({ x, y }) => {
				Object.assign(floatingEl.style, {
					left: `${x}px`,
					top: `${y}px`
				});
			});
		});
	}

	function tooltip(): Attachment<HTMLDivElement> {
		return (element) => {
			const triggerEl = document.querySelector(`[popovertarget='${targetId}']`);
			if (!triggerEl) return;

			const supported = Object.hasOwn(HTMLButtonElement.prototype, 'interestForElement');

			if (supported) {
				// @ts-expect-error
				triggerEl.interestForElement = element;
			} else {
				const offs: Array<() => void> = [];

				offs.push(
					on(
						triggerEl,
						'mouseenter',
						() => (timeout = setTimeout(() => element.showPopover(), delayMs))
					),
					on(triggerEl, 'mouseleave', () => {
						clearTimeout(timeout);
						element.hidePopover();
					}),
					on(
						triggerEl,
						'focusin',
						() => (timeout = setTimeout(() => element.showPopover(), delayMs))
					),
					on(triggerEl, 'focusout', () => {
						clearTimeout(timeout);
						element.hidePopover();
					}),
					on(element, 'beforetoggle', (e) => {
						if (e.newState === 'open') {
							compute(triggerEl, element);
						}
					})
				);

				return () => {
					offs.forEach((off) => off());
					clearTimeout(timeout);
				};
			}
		};
	}
</script>

<PopoverNative popoverType="hint" asChild {targetId} class={className} {@attach tooltip()}>
	{#snippet children({ targetId, action })}
		{@render renderChidren?.({ targetId, action })}
	{/snippet}
	{#snippet content({ open })}
		{@render renderContent?.({ open })}
	{/snippet}
</PopoverNative>
