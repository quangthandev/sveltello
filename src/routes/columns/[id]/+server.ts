import { updateColumnOrder } from '$lib/features/boards/db-queries';
import { updateColumnOrderSchema } from '$lib/features/columns/schemas.js';
import { checkAuthUser } from '$lib/server/auth';
import { error, json } from '@sveltejs/kit';

export async function PATCH({ request, locals, params }) {
	checkAuthUser(locals, `/columns/${params.id}`);

	const data = await request.json();

	const result = await updateColumnOrderSchema.safeParseAsync(data);

	if (!result.success) {
		return error(422, {
			message: result.error.message
		});
	}

	const order = result.data.order;

	if (!order) {
		return error(422, {
			message: 'Missing order'
		});
	}

	await updateColumnOrder(params.id, order, locals.user.id);

	return json({ message: 'ok' });
}
