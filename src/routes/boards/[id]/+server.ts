import { requireAuthCookie } from '$lib/auth.js';
import { json } from '@sveltejs/kit';
import { upsertItem } from './queries.js';

export async function POST({ request, cookies, params }) {
	const userId = requireAuthCookie(cookies);

	const boardId = params.id;

	const { id, title, columnId, order } = await request.json();

	await upsertItem(
		{
			id,
			title,
			columnId,
			order: order,
			boardId: parseInt(boardId)
		},
		userId
	);

	return json({ message: 'ok' });
}
