import { unsplash } from '$lib/server/unsplash.js';

export async function GET() {
	const result = await unsplash.photos.getRandom({
		collectionIds: ['317099'],
		count: 6
	});

	if (result.errors) {
		return Response.json({ errors: result.errors }, { status: 500 });
	}

	return Response.json(result.response);
}
