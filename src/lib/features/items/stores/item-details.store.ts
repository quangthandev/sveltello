import { writable } from 'svelte/store';
import type { ItemFullPayload } from '$lib/types';

export default function createItemDetailsStore() {
	return writable<ItemFullPayload>();
}
