import { checkAuthUser } from '$lib/server/auth.js';
import { error } from '@sveltejs/kit';
import { getItem, updateItemContent, updateItemTitle } from './queries.js';
import { z } from 'zod';

export async function load({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Item not found');
	}

	checkAuthUser(locals, `/items/${params.id}`);

	const item = await getItem(params.id, locals.user.id);

	if (!item) {
		throw error(404, 'Board not found');
	}

	return {
		item: {
			...item,
			column: item.Column
		}
	};
}

const updateItemTitleSchema = z.object({
	title: z.string()
});

const updateItemContentSchema = z.object({
	content: z.string()
});

export const actions = {
	updateItemTitle: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const data = await request.formData();
		const { title } = await updateItemTitleSchema.parseAsync(Object.fromEntries(data));

		await updateItemTitle(id, title, locals.user.id);
	},
	updateItemContent: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const data = await request.formData();
		const { content } = await updateItemContentSchema.parseAsync(Object.fromEntries(data));

		await updateItemContent(id, content, locals.user.id);
	}
};
