import type { Item } from '@prisma/client';
import { writable } from 'svelte/store';

function createPendingItemsStore() {
	const { subscribe, update } = writable(new Map<string, Item>());

	function addItem(item: Item) {
		update((items) => {
			items.set(item.id, item);
			return items;
		});
	}

	function removeItem(id: string) {
		update((items) => {
			items.delete(id);
			return items;
		});
	}

	return {
		subscribe,
		addItem,
		removeItem
	};
}

export const pendingItemsStore = createPendingItemsStore();
