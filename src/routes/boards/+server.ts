import { checkAuthUser } from '$lib/server/auth.js';
import { json } from '@sveltejs/kit';
import { getBoards } from './queries.js';

export async function GET({ locals }) {
	checkAuthUser(locals, '/boards');

	const boards = await getBoards(locals.user.id);

	return json({
		boards
	});
}
