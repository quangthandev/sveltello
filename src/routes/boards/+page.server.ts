import { createBoard, deleteBoard, getBoards } from './queries.js';
import { requireAuthCookie } from '$lib/auth.js';
import { fail } from '@sveltejs/kit';

export async function load({ cookies }) {
	const userId = requireAuthCookie(cookies);

	const boards = await getBoards(userId);

	return { boards };
}

export const actions = {
	create: async ({ cookies, request }) => {
		const userId = requireAuthCookie(cookies);

		const data = await request.formData();
		const name = data.get('name')?.toString() || '';

		if (!name) {
			return fail(400, {
				error: 'Missing name'
			});
		}

		const color = data.get('color')?.toString() || '';

		await createBoard(userId, name, color);
	},
	delete: async ({ cookies, request }) => {
		const userId = requireAuthCookie(cookies);

		const data = await request.formData();
		const boardId = data.get('boardId')?.toString() || '';

		if (!boardId) {
			return fail(400, {
				error: 'Missing board id'
			});
		}

		await deleteBoard(parseInt(boardId), userId);
	}
};
