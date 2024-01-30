import { requireAuthCookie } from '$lib/auth.js';
import { error } from '@sveltejs/kit';
import {
	createColumn,
	deleteCard,
	getBoard,
	updateBoardName,
	updateColumnName,
	upsertItem
} from './queries.js';

export async function load({ cookies, params }) {
	const userId = requireAuthCookie(cookies);

	if (!params.id) {
		throw error(404, 'Board not found');
	}

	const board = await getBoard(Number(params.id), userId);

	if (!board) {
		throw error(404, 'Board not found');
	}

	return { board };
}

export const actions = {
	updateBoardName: async ({ request, cookies }) => {
		const userId = requireAuthCookie(cookies);

		const data = await request.formData();
		const name = data.get('name')?.toString() || '';
		const id = data.get('id')?.toString() || '';

		await updateBoardName(parseInt(id), name, userId);
	},
	createColumn: async ({ request, cookies }) => {
		const userId = requireAuthCookie(cookies);

		const data = await request.formData();
		const name = data.get('name')?.toString() || '';
		const boardId = data.get('boardId')?.toString() || '';

		await createColumn(parseInt(boardId), name, userId);
	},
	updateColumnName: async ({ request, cookies }) => {
		const userId = requireAuthCookie(cookies);

		const data = await request.formData();
		const columnId = data.get('columnId')?.toString() || '';
		const name = data.get('name')?.toString() || '';

		await updateColumnName(columnId, name, userId);
	},
	createCard: async ({ request, cookies, params }) => {
		const userId = requireAuthCookie(cookies);

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
			userId
		);
	},
	deleteCard: async ({ request, cookies }) => {
		const userId = requireAuthCookie(cookies);

		const data = await request.formData();
		const id = data.get('itemId')?.toString() || '';

		await deleteCard(id, userId);
	}
};
