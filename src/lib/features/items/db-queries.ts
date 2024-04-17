import { db } from '$lib/drizzle/db';
import { attachment, board, cover, item } from '$lib/drizzle/schema';
import { and, eq } from 'drizzle-orm';
import { getItemByUserBoard } from '$lib/drizzle/utils';

export async function getItem(id: string, userId: string) {
	const existingItem = await getItemByUserBoard(id, userId);

	if (!existingItem?.Board) {
		return null;
	}

	return await db.query.item.findFirst({
		where: and(eq(item.id, id), eq(item.boardId, existingItem.Board.id)),
		with: {
			board: true,
			column: true,
			attachments: true,
			cover: true
		}
	});
}

export async function deleteItem(id: string, userId: string) {
	const existed = await getItemByUserBoard(id, userId);

	if (!existed?.Board) {
		throw new Error('Item not found');
	}

	return await db
		.delete(item)
		.where(and(eq(item.id, existed.Item.id), eq(item.boardId, existed.Board.id)));
}

export async function updateItemTitle(id: string, title: string, userId: string) {
	const existed = await getItemByUserBoard(id, userId);

	if (!existed?.Board) {
		throw new Error('Item not found');
	}

	return await db
		.update(item)
		.set({ title })
		.where(and(eq(item.id, existed.Item.id), eq(item.boardId, existed.Board.id)));
}

export async function updateItemContent(id: string, content: string, userId: string) {
	const existed = await getItemByUserBoard(id, userId);

	if (!existed?.Board) {
		throw new Error('Item not found');
	}

	return await db
		.update(item)
		.set({ content })
		.where(and(eq(item.id, existed.Item.id), eq(item.boardId, existed.Board.id)));
}

export async function getAttachments(itemId: string, userId: string) {
	const existed = await getItemByUserBoard(itemId, userId);

	if (!existed?.Board) {
		throw new Error('Item not found');
	}

	return await db.select().from(attachment).where(eq(attachment.itemId, existed.Item.id));
}

export async function createAttachment(itemId: string, name: string, type: string, url: string) {
	return await db
		.insert(attachment)
		.values({
			itemId,
			name,
			type,
			url
		})
		.returning();
}

export async function deleteAttachment(id: string, userId: string) {
	const sq = db
		.select()
		.from(attachment)
		.leftJoin(item, eq(attachment.itemId, item.id))
		.leftJoin(board, eq(item.boardId, board.id))
		.where(and(eq(attachment.id, id), eq(board.userId, userId)))
		.as('sq');

	return await db.with(sq).delete(attachment).where(eq(attachment.id, id));
}

export async function getCover(itemId: string, userId: string) {
	const existed = await getItemByUserBoard(itemId, userId);

	if (!existed?.Board) {
		throw new Error('Item not found');
	}

	return await db.select().from(cover).where(eq(cover.itemId, existed.Item.id)).get();
}

export async function makeCover(itemId: string, attachmentId: string, userId: string) {
	const existed = await db
		.select()
		.from(attachment)
		.leftJoin(item, eq(attachment.itemId, item.id))
		.leftJoin(board, eq(item.boardId, board.id))
		.where(and(eq(attachment.id, attachmentId), eq(board.userId, userId)))
		.get();

	if (!existed?.Attachment) {
		throw new Error('Attachment not found');
	}

	const existingItem = await db
		.select()
		.from(item)
		.leftJoin(cover, eq(cover.itemId, item.id))
		.leftJoin(board, eq(board.userId, userId))
		.where(and(eq(cover.itemId, itemId), eq(board.userId, userId)))
		.get();

	// Create a new cover if not existed
	if (!existingItem) {
		return await db
			.insert(cover)
			.values({
				itemId,
				attachmentId,
				url: existed.Attachment.url
			})
			.returning();
	}

	return await db
		.update(cover)
		.set({ attachmentId, url: existed.Attachment.url })
		.where(eq(cover.itemId, itemId));
}
