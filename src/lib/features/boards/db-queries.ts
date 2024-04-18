import { db } from '$lib/drizzle/db';
import { and, asc, eq } from 'drizzle-orm';
import { attachment, board, column, cover, item } from '$lib/drizzle/schema';
import { getColumnByUserBoard, getItemByUserBoard } from '$lib/drizzle/utils';
import type { Attachment, Item, ItemMutation } from '$lib/types';

export async function getBoards(userId: string) {
	const boards = await db.query.board.findMany({
		where: eq(board.userId, userId),
		with: {
			columns: {
				orderBy: [asc(column.order)],
				with: {
					items: {
						orderBy: [asc(item.order)]
					}
				}
			}
		}
	});

	return boards;
}

export async function createBoard(
	userId: string,
	name: string,
	color?: string,
	imageId?: string | null,
	imageThumbUrl?: string | null,
	imageFullUrl?: string | null,
	imageUsername?: string | null,
	imageLinkHtml?: string | null
) {
	const result = await db
		.insert(board)
		.values({
			userId,
			name,
			color,
			imageId,
			imageThumbUrl,
			imageFullUrl,
			imageUsername,
			imageLinkHtml
		})
		.returning();

	return result[0];
}

export async function deleteBoard(boardId: number, userId: string) {
	return await db.delete(board).where(and(eq(board.id, boardId), eq(board.userId, userId)));
}

export async function getBoard(boardId: number, userId: string) {
	return await db.query.board.findFirst({
		where: and(eq(board.id, boardId), eq(board.userId, userId)),
		with: {
			items: true,
			columns: {
				orderBy: [asc(column.order)],
				with: {
					items: {
						orderBy: [asc(column.order)],
						with: {
							cover: true,
							attachments: true
						}
					}
				}
			}
		}
	});
}

export async function updateBoardName(boardId: number, name: string, userId: string) {
	return await db
		.update(board)
		.set({ name })
		.where(and(eq(board.id, boardId), eq(board.userId, userId)));
}

export async function createColumn(boardId: number, name: string, userId: string, id?: string) {
	const existed = await db.query.board.findFirst({
		where: and(eq(board.id, boardId), eq(board.userId, userId)),
		with: {
			columns: {
				orderBy: [asc(column.order)]
			}
		}
	});

	if (!existed) {
		throw new Error('Board not found');
	}

	return await db
		.insert(column)
		.values({
			id,
			boardId,
			name,
			order: existed.columns.length + 1
		})
		.returning();
}

export async function updateColumnName(id: string, name: string, userId: string) {
	const existed = await db
		.select()
		.from(board)
		.leftJoin(column, eq(column.boardId, board.id))
		.where(and(eq(column.id, id), eq(board.userId, userId)))
		.get();

	if (!existed?.Board) {
		throw new Error('Board not found');
	}

	return await db
		.update(column)
		.set({ name })
		.where(and(eq(column.id, id), eq(column.boardId, existed.Board.id)));
}

export async function copyColumn(id: string, name: string, boardId: number, userId: string) {
	const existed = await getColumnByUserBoard(id, userId);

	if (!existed?.Board) {
		throw new Error('Column not found');
	}

	const columnItems = await db.query.item.findMany({
		where: and(eq(item.columnId, id), eq(item.boardId, existed.Board.id)),
		orderBy: [asc(item.order)],
		with: {
			attachments: true
		}
	});

	if (columnItems.length === 0) {
		return;
	}

	const boardColumns = await db.query.column.findMany({
		where: eq(column.boardId, existed.Board.id),
		orderBy: [asc(column.order)]
	});

	let newOrder: number;
	const nextColumn = boardColumns.find((column) => column.order > existed.Column.order);
	if (!nextColumn) {
		newOrder = existed.Column.order + 1;
	} else {
		newOrder = (existed.Column.order + nextColumn.order) / 2;
	}

	// Create new column
	const createdColumn = await db
		.insert(column)
		.values({
			boardId,
			name,
			order: newOrder
		})
		.returning()
		.get();

	// Copy items
	const createdItems = await db
		.insert(item)
		.values(
			columnItems
				.map((item) => ({
					boardId: createdColumn.boardId,
					columnId: createdColumn.id,
					title: item.title,
					content: item.content,
					order: item.order
				}))
				.filter((item): item is Item => item !== null)
		)
		.returning();

	// Copy attachments and cover
	for (const item of columnItems) {
		if (!item || item.attachments.length === 0) {
			continue;
		}

		const itemCover = await db.query.cover.findFirst({
			where: eq(cover.itemId, item.id)
		});

		const attachmentsToCopy = item.attachments
			.map((attachment) => {
				const createdItemId = createdItems.find((i) => i.title === item.title)?.id;

				if (!createdItemId) {
					return null;
				}

				return {
					itemId: createdItemId,
					name: attachment.name,
					url: attachment.url,
					type: attachment.type
				};
			})
			.filter((attachment): attachment is Attachment => attachment !== null);

		await db.insert(attachment).values(attachmentsToCopy);

		if (itemCover) {
			await db.insert(cover).values({
				itemId: createdItems.find((i) => i.title === item.title)!.id,
				url: itemCover.url
			});
		}
	}
}

export async function deleteColumn(id: string, userId: string) {
	const existed = await getColumnByUserBoard(id, userId);

	if (!existed?.Board) {
		throw new Error('Column not found');
	}

	return await db
		.delete(column)
		.where(and(eq(column.id, existed.Column.id), eq(column.boardId, existed.Board.id)));
}

export async function updateColumnOrder(id: string, order: number, userId: string) {
	const existed = await getColumnByUserBoard(id, userId);

	if (!existed?.Board) {
		throw new Error('Column not found');
	}

	return await db.update(column).set({ order }).where(eq(column.id, existed.Column.id));
}

export async function upsertItem(mutation: ItemMutation, userId: string) {
	const existed = await getItemByUserBoard(mutation.id, userId);

	// Create if not existed
	if (!existed?.Item) {
		return await db.insert(item).values(mutation).returning();
	}

	// Update
	return await db.update(item).set(mutation).where(eq(item.id, existed.Item.id)).returning();
}

export async function moveItemToColumn(id: string, columnId: string, userId: string) {
	const existed = await getItemByUserBoard(id, userId);

	if (!existed?.Item) {
		throw new Error('Item not found');
	}

	return db
		.update(item)
		.set({ columnId })
		.where(and(eq(item.id, existed.Item.id), eq(item.boardId, existed.Item.boardId)));
}
