import prisma from '$lib/prisma';
import type { ItemMutation } from './types';

export async function getBoard(boardId: number, accountId: string) {
	return prisma.board.findUnique({
		where: {
			id: boardId,
			accountId: accountId
		},
		include: {
			items: true,
			columns: { orderBy: { order: 'asc' } }
		}
	});
}

export async function updateBoardName(boardId: number, name: string, accountId: string) {
	return prisma.board.update({
		where: { id: boardId, accountId: accountId },
		data: { name }
	});
}

export async function createColumn(boardId: number, name: string, accountId: string) {
	const columnCount = await prisma.column.count({
		where: { boardId, Board: { accountId } }
	});

	return prisma.column.create({
		data: {
			id: crypto.randomUUID(),
			boardId,
			name,
			order: columnCount + 1
		}
	});
}

export function upsertItem(mutation: ItemMutation & { boardId: number }, accountId: string) {
	return prisma.item.upsert({
		where: {
			id: mutation.id,
			Board: {
				accountId
			}
		},
		create: mutation,
		update: mutation
	});
}

export function deleteCard(id: string, accountId: string) {
	return prisma.item.delete({ where: { id, Board: { accountId } } });
}
