import { createBoard, deleteBoard, getBoards } from './queries.js';
import { fail } from '@sveltejs/kit';

export async function load(event) {
	const boards = await getBoards(event.locals.userId);

	return { boards };
}

export const actions = {
	create: async ({ locals, request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString() || '';

		if (!name) {
			return fail(400, {
				error: 'Missing name'
			});
		}

		const color = data.get('color')?.toString() || '';

		await createBoard(locals.userId, name, color);
	},
	delete: async ({ locals, request }) => {
		const data = await request.formData();
		const boardId = data.get('boardId')?.toString() || '';

		if (!boardId) {
			return fail(400, {
				error: 'Missing board id'
			});
		}

		await deleteBoard(parseInt(boardId), locals.userId);
	}
};
