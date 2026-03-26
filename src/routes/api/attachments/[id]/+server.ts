import { checkAuthUser } from '$lib/server/auth';
import { error, json } from '@sveltejs/kit';
import { deleteAttachment } from '$lib/features/item/item.repository';

export async function DELETE({ params, locals }) {
	checkAuthUser(locals);

	if (!params.id) {
		error(422, 'Attachment ID is required');
	}

	const data = await deleteAttachment(params.id, locals.user.id);

	return json(data);
}
