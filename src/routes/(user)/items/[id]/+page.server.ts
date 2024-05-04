import { generateId } from 'lucia';
import { checkAuthUser } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import {
	createAttachment,
	getAttachments,
	getCover,
	getItem,
	makeCover,
	removeCover,
	updateItemContent,
	updateItemTitle
} from '$lib/features/items/db-queries';
import { getColumn } from '$lib/features/columns/db-queries';
import { upsertItem } from '$lib/features/boards/db-queries';
import {
	makeCoverSchema,
	moveOrCopyItemToDestinationSchema,
	updateItemContentSchema,
	updateItemTitleSchema
} from '$lib/features/items/schemas';

export async function load({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Item not found');
	}

	checkAuthUser(locals, `/items/${params.id}`);

	const item = await getItem(params.id, locals.user.id);

	if (!item || !item.board) {
		throw error(404, 'Item not found');
	}

	return {
		title: `${item.title} on ${item.board.name}`,
		item: {
			...item,
			attachments: item.attachments.map((attachment) => ({
				...attachment,
				isCover: item.cover?.attachmentId === attachment.id
			}))
		}
	};
}

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

		await updateItemContent(id, locals.user.id, content);
	},
	moveItemToDestination: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const data = await request.formData();

		const { boardId, columnId, posIndex, title } =
			await moveOrCopyItemToDestinationSchema.parseAsync(Object.fromEntries(data));

		const column = await getColumn(columnId, locals.user.id);

		if (!column) {
			throw error(404, 'Column not found');
		}

		// Calculate order from position index
		const index = posIndex;
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
				boardId: boardId
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

		const { boardId, columnId, posIndex, title } =
			await moveOrCopyItemToDestinationSchema.parseAsync(Object.fromEntries(data));

		const column = await getColumn(columnId, locals.user.id);

		if (!column) {
			throw error(404, 'Column not found');
		}

		// Calculate order from position index
		const index = posIndex;
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

		// Create new item
		const createdItem = await upsertItem(
			{
				id: generateId(15),
				title,
				columnId,
				order,
				boardId: boardId
			},
			locals.user.id
		);

		// Copy attachments
		const attachments = await getAttachments(id, locals.user.id);
		const createdAttachments = [];
		for (const attachment of attachments) {
			const created = await createAttachment(
				createdItem[0].id,
				attachment.name,
				attachment.type,
				attachment.url
			);
			createdAttachments.push(created[0]);
		}

		// Create cover for newly created item
		const originalItemCover = await getCover(id, locals.user.id);
		if (originalItemCover && originalItemCover.attachmentId) {
			const index = attachments.findIndex(
				(attachment) => attachment.id === originalItemCover.attachmentId
			);
			if (index !== -1) {
				await makeCover(createdItem[0].id, createdAttachments[index].id, locals.user.id);
			}
		}
	},
	makeCover: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const data = await request.formData();

		const { attachmentId } = await makeCoverSchema.parseAsync(Object.fromEntries(data));

		if (!attachmentId) {
			throw error(422, 'Attachment ID is required');
		}

		await makeCover(id, attachmentId, locals.user.id);
	},
	removeCover: async ({ locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		await removeCover(id, locals.user.id);
	}
};
