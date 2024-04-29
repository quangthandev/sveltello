import { getBoardsWithColumns } from '$lib/features/boards/db-queries';
import { checkAuthUser } from '$lib/server/auth';
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	checkAuthUser(locals, '/boards');

	const boards = await getBoardsWithColumns(locals.user.id);

	return json(boards);
}
