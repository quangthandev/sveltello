import { generateId } from 'lucia';
import { checkAuthUser } from '$lib/server/auth';
import { error, fail } from '@sveltejs/kit';
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
	makeCoverFromUnsplashSchema,
	makeCoverFromAttachmentSchema,
	moveOrCopyItemToDestinationSchema,
	updateItemContentSchema,
	updateItemTitleSchema
} from '$lib/features/items/schemas';
import { safeParseAsyncFormData } from '$lib/form.js';

export async function load({ locals, params }) {
	if (!params.id) {
		throw error(404, 'Item not found');
	}

	checkAuthUser(locals, `/items/${params.id}`);

	try {
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
	} catch (err) {
		throw error(500, { message: 'Failed to fetch item' });
	}
}

export const actions = {
	updateItemTitle: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const formData = await request.formData();
		const result = await safeParseAsyncFormData(formData, updateItemTitleSchema);

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		try {
			await updateItemTitle(id, result.data.title, locals.user.id);
		} catch (err) {
			return fail(500, { message: 'Failed to update item title' });
		}
	},
	updateItemContent: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const formData = await request.formData();
		const result = await safeParseAsyncFormData(formData, updateItemContentSchema);

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		try {
			await updateItemContent(id, locals.user.id, result.data.content);
		} catch (err) {
			return fail(500, { message: 'Failed to update item content' });
		}
	},
	moveItemToDestination: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const formData = await request.formData();
		const result = await safeParseAsyncFormData(formData, moveOrCopyItemToDestinationSchema);

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		try {
			const { columnId, boardId, title, posIndex } = result.data;

			const column = await getColumn(columnId, locals.user.id);

			if (!column) {
				throw error(404, 'Column not found');
			}

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
		} catch (err) {
			return fail(500, { message: 'Failed to move item' });
		}
	},
	copyItem: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const formData = await request.formData();

		const result = await safeParseAsyncFormData(formData, moveOrCopyItemToDestinationSchema);

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		try {
			const { columnId, boardId, title, posIndex } = result.data;

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
			if (originalItemCover) {
				if (originalItemCover.attachmentId) {
					const index = attachments.findIndex(
						(attachment) => attachment.id === originalItemCover.attachmentId
					);
					if (index !== -1) {
						await makeCover(createdItem[0].id, locals.user.id, {
							source: 'attachment',
							attachmentId: createdAttachments[index].id
						});
					}
				} else if (originalItemCover.unsplashPhotoId && originalItemCover.url) {
					await makeCover(createdItem[0].id, locals.user.id, {
						source: 'unsplash',
						unsplashPhotoId: originalItemCover.unsplashPhotoId,
						url: originalItemCover.url
					});
				}
			}
		} catch (err) {
			return fail(422, { message: 'Failed to copy item' });
		}
	},
	makeCoverFromAttachment: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const formData = await request.formData();
		const result = await safeParseAsyncFormData(formData, makeCoverFromAttachmentSchema);

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		const { attachmentId } = result.data;

		if (!attachmentId) {
			throw error(422, 'Attachment ID is required');
		}

		try {
			await makeCover(id, locals.user.id, {
				source: 'attachment',
				attachmentId
			});
		} catch (err) {
			return fail(500, { message: 'Failed to make cover' });
		}
	},
	makeCoverFromUnsplash: async ({ request, locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		const data = await request.formData();

		const result = await makeCoverFromUnsplashSchema.safeParseAsync(Object.fromEntries(data));

		if (!result.success) {
			return fail(422, { message: result.error.errors[0].message });
		}

		const { url, unsplashPhotoId } = result.data;

		try {
			await makeCover(id, locals.user.id, {
				source: 'unsplash',
				url,
				unsplashPhotoId
			});
		} catch (err) {
			return fail(500, { message: 'Failed to make cover' });
		}
	},
	removeCover: async ({ locals, params }) => {
		const id = params.id;

		if (!id) {
			throw error(422, 'ID is required');
		}

		checkAuthUser(locals, `/items/${params.id}`);

		try {
			await removeCover(id, locals.user.id);
		} catch (err) {
			return fail(500, { message: 'Failed to remove cover' });
		}
	}
};
