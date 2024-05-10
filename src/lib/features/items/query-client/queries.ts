import { createQuery } from '@tanstack/svelte-query';
import type { ItemFullPayload } from '$lib/types';

export const useItem = (id: string, initialData?: ItemFullPayload) => {
	const queryFn = async () => {
		const res = await fetch(`/items/${id}`);

		if (!res.ok) {
			throw new Error('Failed to fetch item');
		}

		return await res.json();
	};

	if (!initialData) {
		return createQuery<ItemFullPayload>({
			queryKey: ['items', id],
			queryFn
		});
	}

	return createQuery<ItemFullPayload>({
		queryKey: ['items', id],
		queryFn,
		initialData
	});
};
