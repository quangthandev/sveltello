import { error } from '@sveltejs/kit';
import { createColumn, getBoard, updateBoardName, updateColumnName } from './queries.js';
import { z } from 'zod';
import { checkAuthUser } from '$lib/server/auth.js';

export async function load({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Board not found');
	}

	checkAuthUser(locals, `/boards/${params.id}`);

	const board = await getBoard(parseInt(params.id), locals.user.id);

	if (!board) {
		throw error(404, 'Board not found');
	}

	return { board };
}

const updateBoardNameSchema = z.object({
	name: z.string(),
	id: z.string()
});

const createColumnSchema = z.object({
	name: z.string(),
	boardId: z.string()
});

const updateColumnNameSchema = z.object({
	columnId: z.string(),
	name: z.string()
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
		const { name, boardId } = await createColumnSchema.parseAsync(Object.fromEntries(data));

		await createColumn(parseInt(boardId), name, locals.user.id);
	},
	updateColumnName: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const data = await request.formData();
		const { columnId, name } = await updateColumnNameSchema.parseAsync(Object.fromEntries(data));

		await updateColumnName(columnId, name, locals.user.id);
	}
};
