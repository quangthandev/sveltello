import { getBoards } from '$lib/features/boards/queries';
import { checkAuthUser } from '$lib/server/auth';
import { json } from '@sveltejs/kit';

export async function GET({ locals }) {
	checkAuthUser(locals, '/boards');

	const boards = await getBoards(locals.user.id);

	return json(boards);
}
