import { unsplash } from '$lib/server/unsplash';
import { error, json } from '@sveltejs/kit';
import { COLLECTION_IDS, RANDOM_PHOTOS_COUNT } from '$lib/features/unsplash/constants';

export async function GET({ url }) {
	const count = Number(url.searchParams.get('count'));

	const result = await unsplash.photos.getRandom({
		collectionIds: COLLECTION_IDS,
		count: Number.isNaN(count) ? RANDOM_PHOTOS_COUNT : count
	});

	if (result.errors) {
		throw error(500);
	}

	const photos = Array.isArray(result.response) ? result.response : [result.response];

	return json(photos);
}
