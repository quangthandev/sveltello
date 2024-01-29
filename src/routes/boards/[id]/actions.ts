import type { ActionReturn } from 'svelte/action';
import { CONTENT_TYPES } from './types';

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

export function draggable(node: HTMLDivElement, params: { id: string; title: string }) {
	const handleDragStart = (event: DragEvent) => {
		if (event.dataTransfer) {
			event.dataTransfer.setData(
				CONTENT_TYPES.card,
				JSON.stringify({ id: params.id, title: params.title })
			);
			event.dataTransfer.effectAllowed = 'move';
		}
	};

	node.addEventListener('dragstart', handleDragStart);

	return {
		destroy() {
			node.removeEventListener('dragstart', handleDragStart);
		}
	};
}

interface DroppableAttributes {
	'on:dragOver': (e: CustomEvent) => void;
	'on:dragLeave': () => void;
	'on:dropItem': (e: CustomEvent) => void;
}

export function droppable(node: HTMLElement): ActionReturn<unknown, DroppableAttributes> {
	const handleDragOver = (event: DragEvent) => {
		if (event.dataTransfer && event.dataTransfer.types.includes(CONTENT_TYPES.card)) {
			event.preventDefault();
			event.stopPropagation();

			node.dispatchEvent(
				new CustomEvent('dragOver', {
					detail: {
						clientY: event.clientY
					}
				})
			);
		}
	};

	const handleDragLeave = () => {
		node.dispatchEvent(new CustomEvent('dragLeave'));
	};

	const handleDrop = (event: DragEvent) => {
		event.stopPropagation();

		if (event.dataTransfer) {
			const data = event.dataTransfer.getData(CONTENT_TYPES.card);

			if (data) {
				node.dispatchEvent(
					new CustomEvent('dropItem', {
						detail: JSON.parse(data)
					})
				);
			}
		}
	};

	node.addEventListener('dragover', handleDragOver);
	node.addEventListener('dragleave', handleDragLeave);
	node.addEventListener('drop', handleDrop);

	return {
		destroy() {
			node.removeEventListener('dragover', handleDragOver);
			node.removeEventListener('dragleave', handleDragLeave);
			node.removeEventListener('drop', handleDrop);
		}
	};
}
