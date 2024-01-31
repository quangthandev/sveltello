import { error } from '@sveltejs/kit';
import {
	createColumn,
	deleteCard,
	getBoard,
	updateBoardName,
	updateColumnName,
	upsertItem
} from './queries.js';

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
	},
	createCard: async ({ request, locals, params }) => {
		const boardId = params.id;

		const data = await request.formData();
		const title = data.get('title')?.toString() || '';
		const columnId = data.get('columnId')?.toString() || '';
		const order = data.get('order')?.toString() || '';

		await upsertItem(
			{
				id: crypto.randomUUID(),
				title,
				columnId,
				order: parseInt(order),
				boardId: parseInt(boardId)
			},
			locals.userId
		);
	},
	deleteCard: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('itemId')?.toString() || '';

		await deleteCard(id, locals.userId);
	}
};
