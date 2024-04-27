import { createQuery } from '@tanstack/svelte-query';
import type { ItemFullPayload } from '$lib/types';

export const useItem = (id: string, initialData?: ItemFullPayload) =>
	createQuery<ItemFullPayload>({
		queryKey: ['items', id],
		queryFn: async () => {
			const res = await fetch(`/items/${id}`);
			return res.json();
		},
		initialData: initialData!
	});
