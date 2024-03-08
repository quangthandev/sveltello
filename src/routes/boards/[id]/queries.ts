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
		where: { boardId, board: { userId } }
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
		where: { id, board: { userId } },
		data: { name }
	});
}

export async function copyColumn(id: string, name: string, userId: string) {
	const columnToCopy = await prisma.column.findUnique({
		where: { id, board: { userId } },
		include: {
			items: {
				orderBy: { order: 'asc' }
			}
		}
	});

	if (!columnToCopy) {
		return;
	}

	const boardColumns = await prisma.column.findMany({
		where: { boardId: columnToCopy.boardId }
	});

	let newOrder: number;
	const nextColumn = boardColumns.find((column) => column.order > columnToCopy.order);
	if (!nextColumn) {
		newOrder = columnToCopy.order + 1;
	} else {
		newOrder = (columnToCopy.order + nextColumn.order) / 2;
	}

	return await prisma.column.create({
		data: {
			id: crypto.randomUUID(),
			boardId: columnToCopy.boardId,
			name,
			order: newOrder,
			items: {
				create: columnToCopy.items.map((item) => ({
					id: crypto.randomUUID(),
					title: item.title,
					content: item.content,
					order: item.order,
					boardId: columnToCopy.boardId
				}))
			}
		},
		include: {
			items: true
		}
	});
}

export async function deleteColumn(id: string, userId: string) {
	return prisma.column.delete({
		where: { id, board: { userId } }
	});
}

export async function updateColumnOrder(id: string, order: number, userId: string) {
	return prisma.column.update({
		where: { id, board: { userId } },
		data: { order }
	});
}

export function upsertItem(mutation: ItemMutation & { boardId: number }, userId: string) {
	return prisma.item.upsert({
		where: {
			id: mutation.id,
			board: {
				userId
			}
		},
		create: mutation,
		update: mutation
	});
}

export function moveItemToColumn(id: string, columnId: string, userId: string) {
	return prisma.item.update({
		where: { id, board: { userId } },
		data: { columnId }
	});
}

export function deleteCard(id: string, userId: string) {
	return prisma.item.delete({ where: { id, board: { userId } } });
}
