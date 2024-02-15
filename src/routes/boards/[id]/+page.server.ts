import { error, fail } from '@sveltejs/kit';
import { createColumn, getBoard, updateBoardName, updateColumnName } from './queries.js';

export async function load({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Board not found');
	}

	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const board = await getBoard(parseInt(params.id), locals.user.id);

	if (!board) {
		throw error(404, 'Board not found');
	}

	return { board };
}

export const actions = {
	updateBoardName: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const data = await request.formData();
		const name = data.get('name')?.toString() || '';
		const id = data.get('id')?.toString() || '';

		await updateBoardName(parseInt(id), name, locals.user.id);
	},
	createColumn: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const data = await request.formData();
		const name = data.get('name')?.toString() || '';
		const boardId = data.get('boardId')?.toString() || '';

		await createColumn(parseInt(boardId), name, locals.user.id);
	},
	updateColumnName: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, {
				error: 'Unauthorized'
			});
		}

		const data = await request.formData();
		const columnId = data.get('columnId')?.toString() || '';
		const name = data.get('name')?.toString() || '';

		await updateColumnName(columnId, name, locals.user.id);
	}
};
