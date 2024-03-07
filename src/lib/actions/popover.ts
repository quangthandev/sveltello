import { autoUpdate, computePosition, flip, offset as offsetFn, shift } from '@floating-ui/dom';
import { noop } from '$lib/utils';
import type { ActionReturn } from 'svelte/action';
import type { FloatingConfig } from './types';
import { trapFocus as useTrapFocus } from './trap-focus';
import { clickOutside as useClickOutside } from './click-outside';
import { escapeKeydown as useEscapeKeydown } from './escape-keydown';

type PopoverOptions = {
	triggerEl: HTMLElement | null;
	open: boolean;
	floatingConfig?: FloatingConfig;
};

interface PopoverAttributes {
	'on:clickOutside'?: (e: CustomEvent<PointerEvent>) => void;
	'on:escapeKeydown'?: (e: CustomEvent<KeyboardEvent>) => void;
}

const defaultFloatingConfig: FloatingConfig = {
	placement: 'bottom-start',
	offset: 6,
	flip: true
};

export function popover(
	node: HTMLElement,
	options: PopoverOptions
): ActionReturn<PopoverOptions, PopoverAttributes> {
	const { triggerEl, open, floatingConfig } = options;

	const mergedFloatingConfig = { ...defaultFloatingConfig, ...floatingConfig };

	if (!triggerEl || !open) {
		return {
			destroy: noop
		};
	}

	const destroyCallbacks: Array<() => void> = [];

	destroyCallbacks.push(
		// floating ui
		useFloating(triggerEl, node, mergedFloatingConfig).destroy,
		// trap focus
		useTrapFocus(node).destroy,
		// click outside
		useClickOutside(node).destroy!,
		// escape keydown
		useEscapeKeydown(node, {
			handler: (e) => {
				node.dispatchEvent(
					new CustomEvent('escapeKeydown', {
						detail: e
					})
				);
			}
		}).destroy
	);

	return {
		destroy() {
			destroyCallbacks.forEach((cb) => cb());
		}
	};
}

function useFloating(anchorEl: HTMLElement, floatingEl: HTMLElement, options: FloatingConfig = {}) {
	if (!anchorEl || !floatingEl)
		return {
			destroy: noop
		};

	function compute() {
		if (!anchorEl || !floatingEl || options === null) return;

		const { placement, offset } = options;

		const middleware = [offsetFn(offset)];

		if (options.flip) {
			middleware.push(flip());
		}

		middleware.push(shift());

		computePosition(anchorEl, floatingEl, {
			placement: placement,
			middleware
		}).then(({ x, y }) => {
			Object.assign(floatingEl.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		});
	}

	return {
		destroy: autoUpdate(anchorEl, floatingEl, compute)
	};
}
