import { createQuery } from '@tanstack/svelte-query';
import type { Random } from 'unsplash-js/dist/methods/photos/types';

const BASE_URL = '/api/unsplash';

export const useUnsplashRandomPhotos = ({
	count,
	enabled = true
}: {
	count: number;
	enabled?: boolean;
}) =>
	createQuery<Random[]>({
		queryKey: ['unsplash-random-photos', count],
		queryFn: async () => {
			const res = await fetch(`${BASE_URL}?count=${count}`);

			if (!res.ok) {
				throw new Error('Failed to fetch photos');
			}

			return res.json();
		},
		enabled,
		staleTime: Infinity // store the data indefinitely until users manually refetch
	});

export const useUnsplashPhoto = (
	id: string | null | undefined,
	{ enabled }: { enabled: boolean }
) =>
	createQuery<Random>({
		queryKey: ['unsplash-photo', id],
		queryFn: async () => {
			const res = await fetch(`${BASE_URL}/${id}`);

			if (!res.ok) {
				throw new Error('Failed to fetch photo');
			}

			return res.json();
		},
		enabled,
		staleTime: Infinity
	});
