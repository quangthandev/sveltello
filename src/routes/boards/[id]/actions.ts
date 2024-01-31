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

interface DraggableAttributes {
	'on:dragStart': (e: CustomEvent<{ draggedEl: HTMLDivElement }>) => void;
	'on:dragEnd': (e: CustomEvent<{ draggedEl: HTMLDivElement }>) => void;
}

type DraggableOptions = {
	id: string;
	columnId: string;
	title: string;
	order: number;
};

export function draggable(
	node: HTMLDivElement,
	options: DraggableOptions
): ActionReturn<DraggableOptions, DraggableAttributes> {
	if (!node.draggable) {
		throw new Error('Node using draggable action must have draggable attribute set to true');
	}

	const handleDragStart = (event: DragEvent) => {
		if (event.dataTransfer) {
			const { id, columnId, title, order } = options;
			event.dataTransfer.setData(
				CONTENT_TYPES.card,
				JSON.stringify({ id, columnId, title, order })
			);
			event.dataTransfer.effectAllowed = 'move';
			node.dispatchEvent(
				new CustomEvent('dragStart', {
					detail: {
						draggedEl: node
					}
				})
			);
		}
	};

	const handleDragEnd = () => {
		node.dispatchEvent(
			new CustomEvent('dragEnd', {
				detail: {
					draggedEl: node
				}
			})
		);
	};

	node.addEventListener('dragstart', handleDragStart);
	node.addEventListener('dragend', handleDragEnd);

	return {
		update(newOptions) {
			options = newOptions;
		},
		destroy() {
			node.removeEventListener('dragstart', handleDragStart);
			node.removeEventListener('dragend', handleDragEnd);
		}
	};
}

interface DroppableAttributes {
	'on:dragOver': (e: CustomEvent<{ clientY: number }>) => void;
	'on:dragLeave': (e: CustomEvent) => void;
	'on:dropItem': (e: CustomEvent) => void;
}

type DroppableOptions = {
	enabled: boolean;
};

export function droppable(
	node: HTMLElement,
	options: DroppableOptions = { enabled: true }
): ActionReturn<DroppableOptions, DroppableAttributes> {
	const handleDragOver = (event: DragEvent) => {
		if (event.dataTransfer && event.dataTransfer.types.includes(CONTENT_TYPES.card)) {
			event.preventDefault();

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

	function createListeners() {
		node.addEventListener('dragover', handleDragOver);
		node.addEventListener('dragleave', handleDragLeave);
		node.addEventListener('drop', handleDrop);
	}

	function destroyListeners() {
		node.removeEventListener('dragover', handleDragOver);
		node.removeEventListener('dragleave', handleDragLeave);
		node.removeEventListener('drop', handleDrop);
	}

	if (options.enabled) {
		createListeners();
	}

	return {
		update(options) {
			if (options.enabled) {
				createListeners();
			} else {
				destroyListeners();
			}
		},
		destroy: destroyListeners
	};
}
