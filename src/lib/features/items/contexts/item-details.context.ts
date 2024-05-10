import { createContext } from '$lib/context';
import { getContext } from 'svelte';
import type { ItemFullPayload } from '$lib/types';
import type { Writable } from 'svelte/store';

const ITEM_DETAILS_CONTEXT_KEY = '$$context_item-details';

export function createItemDetailsContext() {
	return createContext<Writable<ItemFullPayload>>(ITEM_DETAILS_CONTEXT_KEY);
}

export function getItemDetailsContext() {
	return getContext<Writable<ItemFullPayload>>(ITEM_DETAILS_CONTEXT_KEY);
}
