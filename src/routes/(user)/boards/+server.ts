import { getBoardsWithColumns } from '$lib/features/boards/db-queries';
import { checkAuthUser } from '$lib/server/auth';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals }) {
	checkAuthUser(locals, '/boards');

	try {
		const boards = await getBoardsWithColumns(locals.user.id);

		return json(boards);
	} catch (err) {
		throw error(500, { message: 'Failed to fetch boards' });
	}
}
