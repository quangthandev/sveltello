import { computePosition, flip, offset, shift } from '@floating-ui/dom';
import type { ActionReturn } from 'svelte/action';

type PopoverOptions = {
	content: HTMLElement;
	offset?: number;
};

type PopoverAttributes = {
	'on:trigger': (e: MouseEvent) => void;
};

export function popover(
	node: HTMLElement,
	options: PopoverOptions
): ActionReturn<PopoverOptions, PopoverAttributes> {
	const handleClick = (event: MouseEvent) => {
		updatePosition();

		node.dispatchEvent(new CustomEvent('trigger', { detail: event }));
	};

	function updatePosition() {
		const content = options.content;

		computePosition(node, content, {
			placement: 'bottom-start',
			middleware: [offset(options.offset ?? 6), flip(), shift()]
		}).then(({ x, y }) => {
			Object.assign(content.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		});
	}

	node.addEventListener('click', handleClick);

	return {
		update(newOptions) {
			options = newOptions;
		},
		destroy() {
			node.removeEventListener('click', handleClick);
		}
	};
}
