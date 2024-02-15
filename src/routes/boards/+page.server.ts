import { createBoard, deleteBoard, getBoards } from './queries.js';
import { fail } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user) {
		return fail(401, {
			error: 'Unauthorized'
		});
	}

	const boards = await getBoards(locals.user.id);

	return { boards };
}

export const actions = {
	create: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const data = await request.formData();
		const name = data.get('name')?.toString() || '';

		if (!name) {
			return fail(400, {
				error: 'Missing name'
			});
		}

		const color = data.get('color')?.toString() || '';

		await createBoard(locals.user.id, name, color);
	},
	delete: async ({ locals, request }) => {
		if (!locals.user) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const data = await request.formData();
		const boardId = data.get('boardId')?.toString() || '';

		if (!boardId) {
			return fail(400, {
				error: 'Missing board id'
			});
		}

		await deleteBoard(parseInt(boardId), locals.user.id);
	}
};
