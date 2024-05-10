import { error, fail } from '@sveltejs/kit';
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
import { safeParseAsyncFormData } from '$lib/form.js';

export async function load({ locals, params }) {
	checkAuthUser(locals, `/boards/${params.id}`);

	try {
		const board = await getBoard(Number(params.id), locals.user.id);

		if (!board) {
			throw error(404, 'Board not found');
		}

		const boards = await getBoardsWithColumns(locals.user.id);

		return { title: board.name, board, boards };
	} catch (err) {
		throw error(500, { message: 'Failed to fetch board' });
	}
}

export const actions = {
	updateBoardName: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const formData = await request.formData();
		const result = await safeParseAsyncFormData(formData, updateBoardNameSchema);

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		const { id, name } = result.data;

		if (!id) {
			return fail(422, { message: 'Invalid board ID' });
		}

		try {
			await updateBoardName(id, name, locals.user.id);
		} catch (err) {
			return fail(500, { message: 'Failed to update board name' });
		}
	},
	updateColumnName: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const formData = await request.formData();
		const result = await safeParseAsyncFormData(formData, updateColumnNameSchema);

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		const { id, name } = result.data;

		if (!id) {
			return fail(422, { message: 'Invalid column ID' });
		}

		try {
			await updateColumnName(id, name, locals.user.id);
		} catch (err) {
			return fail(500, { message: 'Failed to update column name' });
		}
	},
	deleteColumn: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const formData = await request.formData();
		const result = await safeParseAsyncFormData(formData, deleteColumnSchema);

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		const { id } = result.data;

		if (!id) {
			return fail(422, { message: 'Invalid column ID' });
		}

		try {
			await deleteColumn(id, locals.user.id);
		} catch (err) {
			return fail(500, { message: 'Failed to update column name' });
		}
	},
	copyColumn: async ({ request, locals, params }) => {
		checkAuthUser(locals, `/boards/${params.id}`);

		const formData = await request.formData();
		const result = await safeParseAsyncFormData(formData, copyColumnSchema);

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		const { id, name } = result.data;

		if (!id) {
			return fail(422, { message: 'Invalid column ID' });
		}

		// Check if the board exists
		const board = await getBoard(Number(params.id), locals.user.id);

		if (!board) {
			throw error(404, 'Board not found');
		}

		try {
			await copyColumn(id, name, board.id, locals.user.id);
		} catch (err) {
			return fail(500, { message: 'Failed to copy column' });
		}
	}
};
