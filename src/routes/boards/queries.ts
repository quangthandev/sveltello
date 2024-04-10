import { db } from '$lib/server/drizzle/db';
import { board, column, item } from '$lib/server/drizzle/schema';
import { and, asc, eq } from 'drizzle-orm';

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
	color: string,
	imageId?: string,
	imageThumbUrl?: string,
	imageFullUrl?: string,
	imageUsername?: string,
	imageLinkHtml?: string
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
