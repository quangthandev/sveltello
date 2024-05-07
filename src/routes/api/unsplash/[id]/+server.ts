import { unsplash } from '$lib/server/unsplash';
import { error, json } from '@sveltejs/kit';

export async function GET({ params }) {
	if (!params.id) {
		throw error(422, 'Photo ID is required');
	}

	const result = await unsplash.photos.get({ photoId: params.id });

	if (result.errors) {
		throw error(500);
	}

	return json(result.response);
}
