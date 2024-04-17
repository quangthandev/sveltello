import { db } from '$lib/drizzle/db';
import { column, item } from '$lib/drizzle/schema';
import { and, asc, eq } from 'drizzle-orm';
import { getColumnByUserBoard } from '$lib/drizzle/utils';

export async function getColumn(id: string, userId: string) {
	const existed = await getColumnByUserBoard(id, userId);

	if (!existed?.Board) {
		return null;
	}

	return await db.query.column.findFirst({
		where: and(eq(column.id, id), eq(column.boardId, existed.Board.id)),
		with: {
			items: {
				orderBy: [asc(item.order)],
				with: {
					attachments: true,
					cover: true
				}
			}
		}
	});
}
