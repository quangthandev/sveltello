import { createQuery } from '@tanstack/svelte-query';
import type { ItemFullPayload } from '$lib/types';

export const useItem = (id: string, initialData?: ItemFullPayload) => {
	if (!initialData) {
		return createQuery<ItemFullPayload>({
			queryKey: ['items', id],
			queryFn: async () => {
				const res = await fetch(`/items/${id}`);
				return res.json();
			}
		});
	}

	return createQuery<ItemFullPayload>({
		queryKey: ['items', id],
		queryFn: async () => {
			const res = await fetch(`/items/${id}`);
			return res.json();
		},
		initialData
	});
};
