import { checkAuthUser } from '$lib/server/auth.js';
import { json } from '@sveltejs/kit';
import { updateColumnOrder } from '../../boards/[id]/queries.js';

export async function PATCH({ request, locals, params }) {
	checkAuthUser(locals, `/columns/${params.id}`);

	const { order } = await request.json();

	await updateColumnOrder(params.id, order, locals.user.id);

	return json({ message: 'ok' });
}
