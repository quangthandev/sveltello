import { checkAuthUser } from '$lib/server/auth';
import { json } from '@sveltejs/kit';
import { getBoards } from './queries';

export async function GET({ locals }) {
	checkAuthUser(locals, '/boards');

	const boards = await getBoards(locals.user.id);

	return json({
		boards
	});
}
