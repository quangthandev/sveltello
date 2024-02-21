import type { ActionReturn } from 'svelte/action';

interface ClickOutsideAttibutes {
	'on:clickOutside': (e: CustomEvent) => void;
}

export function clickOutside(node: HTMLElement): ActionReturn<unknown, ClickOutsideAttibutes> {
	const handleClick = (event: Event) => {
		if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('clickOutside'));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
