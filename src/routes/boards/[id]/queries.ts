import prisma from '$lib/server/prisma';
import type { ItemMutation } from './types';

export async function getBoard(boardId: number, userId: string) {
	return prisma.board.findUnique({
		where: {
			id: boardId,
			userId
		},
		include: {
			items: true,
			columns: {
				orderBy: { order: 'asc' },
				include: {
					items: {
						orderBy: { order: 'asc' }
					}
				}
			}
		}
	});
}

export async function updateBoardName(boardId: number, name: string, userId: string) {
	return prisma.board.update({
		where: { id: boardId, userId },
		data: { name }
	});
}

export async function createColumn(boardId: number, name: string, userId: string, id?: string) {
	const columnCount = await prisma.column.count({
		where: { boardId, Board: { userId } }
	});

	return prisma.column.create({
		data: {
			id: id ?? crypto.randomUUID(),
			boardId,
			name,
			order: columnCount + 1
		}
	});
}

export async function updateColumnName(id: string, name: string, userId: string) {
	return prisma.column.update({
		where: { id, Board: { userId } },
		data: { name }
	});
}

export async function updateColumnOrder(id: string, order: number, userId: string) {
	return prisma.column.update({
		where: { id, Board: { userId } },
		data: { order }
	});
}

export function upsertItem(mutation: ItemMutation & { boardId: number }, userId: string) {
	return prisma.item.upsert({
		where: {
			id: mutation.id,
			Board: {
				userId
			}
		},
		create: mutation,
		update: mutation
	});
}

export function deleteCard(id: string, userId: string) {
	return prisma.item.delete({ where: { id, Board: { userId } } });
}
