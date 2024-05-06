import { error } from '@sveltejs/kit';
import {
	copyColumn,
	deleteColumn,
	getBoard,
	getBoardsWithColumns,
	updateBoardName,
	updateColumnName
} from '$lib/features/boards/db-queries';
import { checkAuthUser } from '$lib/server/auth';
import { updateBoardNameSchema } from '$lib/features/boards/schemas';
import {
	copyColumnSchema,
	deleteColumnSchema,
	updateColumnNameSchema
} from '$lib/features/columns/schemas';

export async function load({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Board not found');
	}

	checkAuthUser(locals, `/boards/${params.id}`);

	if (isNaN(Number(params.id))) {
		throw error(404, 'Board not found');
	}

	const board = await getBoard(parseInt(params.id), locals.user.id);

	if (!board) {
		throw error(404, 'Board not found');
	}

	const boards = await getBoardsWithColumns(locals.user.id);

	return { title: board.name, board, boards };
}

export const actions = {
	updateBoardName: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const data = await request.formData();
		const { name, id } = await updateBoardNameSchema.parseAsync(Object.fromEntries(data));

		if (!id) {
			throw error(400, 'Invalid board id');
		}

		await updateBoardName(id, name, locals.user.id);
	},
	updateColumnName: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const data = await request.formData();
		const { id, name } = await updateColumnNameSchema.parseAsync(Object.fromEntries(data));

		if (!id) {
			throw error(400, 'Invalid column id');
		}

		await updateColumnName(id, name, locals.user.id);
	},
	deleteColumn: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const data = await request.formData();

		const { id } = await deleteColumnSchema.parseAsync(Object.fromEntries(data));

		if (!id) {
			throw error(400, 'Invalid column id');
		}

		await deleteColumn(id, locals.user.id);
	},
	copyColumn: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const data = await request.formData();
		const { id, name } = await copyColumnSchema.parseAsync(Object.fromEntries(data));

		if (!id) {
			throw error(400, 'Invalid column id');
		}

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
