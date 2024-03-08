import { error } from '@sveltejs/kit';
import {
	copyColumn,
	createColumn,
	deleteColumn,
	getBoard,
	updateBoardName,
	updateColumnName,
	upsertItem
} from './queries.js';
import { z } from 'zod';
import { checkAuthUser } from '$lib/server/auth.js';
import { getBoards } from '../queries.js';
import { getColumn } from '../../columns/queries.js';

export async function load({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Board not found');
	}

	checkAuthUser(locals, `/boards/${params.id}`);

	const board = await getBoard(parseInt(params.id), locals.user.id);
	const boards = await getBoards(locals.user.id);

	if (!board) {
		throw error(404, 'Board not found');
	}

	return { board, boards };
}

const updateBoardNameSchema = z.object({
	name: z.string(),
	id: z.string()
});

const createColumnSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	boardId: z.string()
});

const updateColumnNameSchema = z.object({
	columnId: z.string(),
	name: z.string()
});

const copyColumnSchema = z.object({
	id: z.string(),
	name: z.string()
});

const deleteColumnSchema = z.object({
	id: z.string()
});

const moveItemSchema = z.object({
	boardId: z.string(),
	columnId: z.string(),
	title: z.string(),
	posIndex: z.string()
});

export const actions = {
	updateBoardName: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const data = await request.formData();
		const { name, id } = await updateBoardNameSchema.parseAsync(Object.fromEntries(data));

		await updateBoardName(parseInt(id), name, locals.user.id);
	},
	createColumn: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const data = await request.formData();
		const { id, name, boardId } = await createColumnSchema.parseAsync(Object.fromEntries(data));

		await createColumn(parseInt(boardId), name, locals.user.id, id);
	},
	updateColumnName: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const data = await request.formData();
		const { columnId, name } = await updateColumnNameSchema.parseAsync(Object.fromEntries(data));

		await updateColumnName(columnId, name, locals.user.id);
	},
	deleteColumn: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const data = await request.formData();

		const { id } = await deleteColumnSchema.parseAsync(Object.fromEntries(data));

		await deleteColumn(id, locals.user.id);
	},
	copyColumn: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const data = await request.formData();
		const { id, name } = await copyColumnSchema.parseAsync(Object.fromEntries(data));

		await copyColumn(id, name, locals.user.id);
	},
	moveItemToDestination: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const data = await request.formData();

		const { boardId, columnId, posIndex, title } = await moveItemSchema.parseAsync(
			Object.fromEntries(data)
		);

		const column = await getColumn(columnId, locals.user.id);

		if (!column) {
			throw error(404, 'Column not found');
		}

		// Calculate order from position index
		const index = parseInt(posIndex);
		let order;
		if (index === 1) {
			if (column.items.length === 0) {
				order = 1;
			} else {
				order = column.items[0].order / 2;
			}
		} else if (index === column.items.length) {
			order = column.items[index - 1].order + 1;
		} else {
			order = (column.items[index - 2].order + column.items[index - 1].order) / 2;
		}

		await upsertItem(
			{
				id,
				title,
				columnId,
				order,
				boardId: parseInt(boardId)
			},
			locals.user.id
		);
	}
};
