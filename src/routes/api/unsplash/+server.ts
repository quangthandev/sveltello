import { unsplash } from '$lib/server/unsplash';
import { error, json } from '@sveltejs/kit';

export async function GET() {
	const result = await unsplash.photos.getRandom({
		collectionIds: ['317099'],
		count: 6
	});

	if (result.errors) {
		throw error(500);
	}

	return json(result.response);
}
