import { checkAuthUser } from '$lib/server/auth';
import { createBoard, deleteBoard, getBoards } from '$lib/features/boards/db-queries';
import { fail, redirect } from '@sveltejs/kit';
import { createBoardSchema, deleteBoardSchema } from '$lib/features/boards/schemas';

export async function load({ locals }) {
	checkAuthUser(locals, '/boards');

	const boards = await getBoards(locals.user.id);

	return { title: 'Boards', boards };
}

export const actions = {
	create: async ({ locals, request }) => {
		checkAuthUser(locals, '/boards');

		const data = await request.formData();
		const { name, color, imageId, imageThumbUrl, imageFullUrl, imageUsername, imageLinkHtml } =
			await createBoardSchema.parseAsync(Object.fromEntries(data));

		const newBoard = await createBoard(
			locals.user.id,
			name,
			color,
			imageId,
			imageThumbUrl,
			imageFullUrl,
			imageUsername,
			imageLinkHtml
		);

		redirect(303, `/boards/${newBoard.id}`);
	},
	delete: async ({ locals, request }) => {
		checkAuthUser(locals, '/boards');

		const data = await request.formData();

		const result = await deleteBoardSchema.safeParseAsync(Object.fromEntries(data));

		if (!result.success) {
			return fail(422, {
				error: result.error.message
			});
		}

		const id = result.data.id;

		if (!id) {
			return fail(422, {
				error: 'Missing board id'
			});
		}

		await deleteBoard(id, locals.user.id);
	}
};
