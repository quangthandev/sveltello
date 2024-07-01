import { createQuery, type QueryOptions } from '@tanstack/svelte-query';
import type { ItemFullPayload } from '$lib/types';

export const useItem = (id: string, initialData?: ItemFullPayload) => {
	const queryOptions = useItemQueryOptions(id);

	if (!initialData) {
		return createQuery<ItemFullPayload>(queryOptions);
	}

	return createQuery<ItemFullPayload>({
		...queryOptions,
		initialData
	});
};

export const useItemQueryOptions = (id: string) =>
	({
		queryKey: ['items', id],
		queryFn: async () => {
			const res = await fetch(`/items/${id}`);

			if (!res.ok) {
				throw new Error('Failed to fetch item');
			}

			return await res.json();
		}
	}) satisfies QueryOptions;
