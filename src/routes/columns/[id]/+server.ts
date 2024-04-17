import { updateColumnOrder } from '$lib/features/boards/db-queries';
import { checkAuthUser } from '$lib/server/auth';
import { json } from '@sveltejs/kit';

export async function PATCH({ request, locals, params }) {
	checkAuthUser(locals, `/columns/${params.id}`);

	const { order } = await request.json();

	await updateColumnOrder(params.id, order, locals.user.id);

	return json({ message: 'ok' });
}
