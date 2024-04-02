import { checkAuthUser } from '$lib/server/auth.js';
import { error } from '@sveltejs/kit';
import { getItem, makeCover, updateItemContent, updateItemTitle } from './queries.js';
import { z } from 'zod';
import { upsertItem } from '../../boards/[id]/queries.js';
import { getColumn } from '../../columns/queries.js';

export async function load({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Item not found');
	}

	checkAuthUser(locals, `/items/${params.id}`);

	const item = await getItem(params.id, locals.user.id);

	if (!item) {
		throw error(404, 'Item not found');
	}

	return {
		item: {
			...item,
			attachments: item.attachments.map((attachment) => ({
				...attachment,
				isCover: item.cover?.attachmentId === attachment.id
			}))
		}
	};
}

const updateItemTitleSchema = z.object({
	title: z.string()
});

const updateItemContentSchema = z.object({
	content: z.string()
});

const moveOrCopyItemSchema = z.object({
	boardId: z.string(),
	columnId: z.string(),
	title: z.string(),
	posIndex: z.string()
});

const makeCoverSchema = z.object({
	attachmentId: z.string()
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
	},
	moveItemToDestination: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const data = await request.formData();

		const { boardId, columnId, posIndex, title } = await moveOrCopyItemSchema.parseAsync(
			Object.fromEntries(data)
		);

		const column = await getColumn(columnId, locals.user.id);

		if (!column) {
			throw error(404, 'Column not found');
		}

		// Calculate order from position index
		const index = parseInt(posIndex);
		let order;
		if (index === 1) {
			if (column.items.length === 0) {
				order = 1;
			} else {
				order = column.items[0].order / 2;
			}
		} else if (index === column.items.length) {
			order = column.items[index - 1].order + 1;
		} else {
			order = (column.items[index - 2].order + column.items[index - 1].order) / 2;
		}

		await upsertItem(
			{
				id,
				title,
				columnId,
				order,
				boardId: parseInt(boardId)
			},
			locals.user.id
		);
	},
	copyItem: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const data = await request.formData();

		const { boardId, columnId, posIndex, title } = await moveOrCopyItemSchema.parseAsync(
			Object.fromEntries(data)
		);

		const column = await getColumn(columnId, locals.user.id);

		if (!column) {
			throw error(404, 'Column not found');
		}

		// Calculate order from position index
		const index = parseInt(posIndex);
		let order;
		if (index === 1) {
			if (column.items.length === 0) {
				order = 1;
			} else {
				order = column.items[0].order / 2;
			}
		} else if (index === column.items.length) {
			order = column.items[index - 1].order + 1;
		} else {
			order = (column.items[index - 2].order + column.items[index - 1].order) / 2;
		}

		await upsertItem(
			{
				id: crypto.randomUUID(),
				title,
				columnId,
				order,
				boardId: parseInt(boardId)
			},
			locals.user.id
		);
	},
	makeCover: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const data = await request.formData();

		const { attachmentId } = await makeCoverSchema.parseAsync(Object.fromEntries(data));

		await makeCover(id, attachmentId, locals.user.id);
	}
};
