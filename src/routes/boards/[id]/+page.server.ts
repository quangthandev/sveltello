import { error } from '@sveltejs/kit';
import { copyColumn, deleteColumn, getBoard, updateBoardName, updateColumnName } from './queries';
import { z } from 'zod';
import { checkAuthUser } from '$lib/server/auth';
import { getBoards } from '../queries';

export async function load({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Board not found');
	}

	checkAuthUser(locals, `/boards/${params.id}`);

	if (isNaN(Number(params.id))) {
		throw error(404, 'Board not found');
	}

	const board = await getBoard(parseInt(params.id), locals.user.id);
	const boards = await getBoards(locals.user.id);

	if (!board) {
		throw error(404, 'Board not found');
	}

	return { title: board.name, board, boards };
}

const updateBoardNameSchema = z.object({
	name: z.string(),
	id: z.string()
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

export const actions = {
	updateBoardName: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const data = await request.formData();
		const { name, id } = await updateBoardNameSchema.parseAsync(Object.fromEntries(data));

		await updateBoardName(parseInt(id), name, locals.user.id);
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

		// Check if the board exists
		const board = await getBoard(parseInt(params.id), locals.user.id);

		if (!board) {
			throw error(404, 'Board not found');
		}

		try {
			await copyColumn(id, name, board.id, locals.user.id);
		} catch (err) {
			if (err instanceof Error) {
				throw error(400, err.message);
			}
			throw error(500, 'Something went wrong. Please try again.');
		}
	}
};
