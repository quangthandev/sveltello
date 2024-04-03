import { checkAuthUser } from '$lib/server/auth.js';
import { z } from 'zod';
import { createBoard, deleteBoard, getBoards } from './queries.js';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	checkAuthUser(locals, '/boards');

	const boards = await getBoards(locals.user.id);

	return { title: 'Boards', boards };
}

const createBoardSchema = z.object({
	name: z.string(),
	color: z.string(),
	imageId: z.string().optional(),
	imageThumbUrl: z.string().optional(),
	imageFullUrl: z.string().optional(),
	imageUsername: z.string().optional(),
	imageLinkHTML: z.string().optional()
});

export const actions = {
	create: async ({ locals, request }) => {
		checkAuthUser(locals, '/boards');

		const data = await request.formData();
		const { name, color, imageId, imageThumbUrl, imageFullUrl, imageUsername, imageLinkHTML } =
			await createBoardSchema.parseAsync(Object.fromEntries(data));

		const newBoard = await createBoard(
			locals.user.id,
			name,
			color,
			imageId,
			imageThumbUrl,
			imageFullUrl,
			imageUsername,
			imageLinkHTML
		);

		redirect(303, `/boards/${newBoard.id}`);
	},
	delete: async ({ locals, request }) => {
		checkAuthUser(locals, '/boards');

		const data = await request.formData();
		const boardId = data.get('boardId')?.toString() || '';

		if (!boardId) {
			return fail(400, {
				error: 'Missing board id'
			});
		}

		await deleteBoard(parseInt(boardId), locals.user.id);
	}
};
