import { error } from '@sveltejs/kit';
import { createColumn, getBoard, updateBoardName, updateColumnName } from './db.js';

export async function load({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Board not found');
	}

	const board = await getBoard(Number(params.id), locals.userId);

	if (!board) {
		throw error(404, 'Board not found');
	}

	return { board };
}

export const actions = {
	updateBoardName: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString() || '';
		const id = data.get('id')?.toString() || '';

		await updateBoardName(parseInt(id), name, locals.userId);
	},
	createColumn: async ({ request, locals }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString() || '';
		const boardId = data.get('boardId')?.toString() || '';

		await createColumn(parseInt(boardId), name, locals.userId);
	},
	updateColumnName: async ({ request, locals }) => {
		const data = await request.formData();
		const columnId = data.get('columnId')?.toString() || '';
		const name = data.get('name')?.toString() || '';

		await updateColumnName(columnId, name, locals.userId);
	}
};
