import { autoUpdate, computePosition, flip, offset as offsetFn, shift } from '@floating-ui/dom';
import { noop } from '$lib/utils';
import type { ActionReturn } from 'svelte/action';
import { trapFocus } from './trap-focus';
import type { FloatingConfig } from './types';
import { clickOutside } from './click-outside';

type PopoverOptions = {
	triggerEl: HTMLElement | null;
	open: boolean;
	floatingConfig?: FloatingConfig;
};

interface PopoverAttributes {
	'on:clickOutside'?: (e: CustomEvent<PointerEvent>) => void;
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
		trapFocus(node).destroy,
		// click outside
		clickOutside(node).destroy!
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
