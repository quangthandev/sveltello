import { unsplash } from '$lib/server/unsplash';
import { error, json } from '@sveltejs/kit';
import { RANDOM_PHOTOS_COUNT } from '$lib/features/unsplash/constants.js';

export async function GET({ url }) {
	const count = Number(url.searchParams.get('count'));

	const result = await unsplash.photos.getRandom({
		collectionIds: ['317099'],
		count: Number.isNaN(count) ? RANDOM_PHOTOS_COUNT : count
	});

	if (result.errors) {
		throw error(500);
	}

	const photos = Array.isArray(result.response) ? result.response : [result.response];

	return json(photos);
}
