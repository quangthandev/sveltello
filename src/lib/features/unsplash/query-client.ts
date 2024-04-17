import { createQuery } from '@tanstack/svelte-query';
import type { Random } from 'unsplash-js/dist/methods/photos/types';

export const useRandomPhotos = (visible: boolean) =>
	createQuery<Random[]>({
		queryKey: ['unsplash-random'],
		queryFn: async () => {
			const res = await fetch('/api/unsplash');

			if (!res.ok) {
				throw new Error('Failed to fetch photos');
			}

			return res.json();
		},
		enabled: visible,
		staleTime: Infinity // store the data indefinitely until users manually refetch
	});
