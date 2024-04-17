import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { board, column, item } from './schema';

export function getBoardByUser(userId: string) {
	return db.select().from(board).where(eq(board.userId, userId)).get();
}

export function getColumnByUserBoard(id: string, userId: string) {
	return db
		.select()
		.from(column)
		.leftJoin(board, eq(column.boardId, board.id))
		.where(and(eq(column.id, id), eq(board.userId, userId)))
		.get();
}

export function getItemByUserBoard(id: string, userId: string) {
	return db
		.select()
		.from(item)
		.leftJoin(column, eq(item.columnId, column.id))
		.leftJoin(board, eq(column.boardId, board.id))
		.where(and(eq(item.id, id), eq(board.userId, userId)))
		.get();
}
