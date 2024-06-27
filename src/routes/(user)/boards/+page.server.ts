import { checkAuthUser } from '$lib/server/auth';
import { createBoard, deleteBoard } from '$lib/features/boards/db-queries';
import { error, fail, redirect } from '@sveltejs/kit';
import { createBoardSchema, deleteBoardSchema } from '$lib/features/boards/schemas';
import { safeParseAsyncFormData } from '$lib/form';

export async function load({ locals }) {
	checkAuthUser(locals, '/boards');

	try {
		return { title: 'Boards' };
	} catch (err) {
		throw error(500, { message: 'Failed to fetch boards' });
	}
}

export const actions = {
	create: async ({ locals, request }) => {
		checkAuthUser(locals, '/boards');

		const formData = await request.formData();
		const result = await safeParseAsyncFormData(formData, createBoardSchema);

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		const {
			name,
			color,
			imageId,
			imageThumbUrl,
			imageFullUrl,
			imageUsername,
			imageLinkHtml,
			imageAltDescription
		} = result.data;

		let newBoard;

		try {
			newBoard = await createBoard(
				locals.user.id,
				name,
				color,
				imageId,
				imageThumbUrl,
				imageFullUrl,
				imageUsername,
				imageLinkHtml,
				imageAltDescription
			);
		} catch (err) {
			return fail(500, { message: 'Failed to create board' });
		}

		if (newBoard) {
			redirect(303, `/boards/${newBoard.id}`);
		}
	},
	delete: async ({ locals, request }) => {
		checkAuthUser(locals, '/boards');

		const formData = await request.formData();
		const result = await safeParseAsyncFormData(formData, deleteBoardSchema);

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		const id = result.data.id;

		if (!id) {
			return fail(422, {
				error: 'Missing board id'
			});
		}

		try {
			await deleteBoard(id, locals.user.id);
		} catch (err) {
			return fail(500, { message: 'Failed to delete board' });
		}
	}
};
