import prisma from '$lib/server/prisma';

export async function getBoards(userId: string) {
	return prisma.board.findMany({
		where: {
			userId: userId
		},
		include: {
			columns: {
				orderBy: {
					order: 'asc'
				},
				include: {
					items: {
						orderBy: {
							order: 'asc'
						}
					}
				}
			}
		}
	});
}

export async function createBoard(userId: string, name: string, color: string) {
	return prisma.board.create({
		data: {
			name,
			color,
			user: {
				connect: {
					id: userId
				}
			}
		}
	});
}

export async function deleteBoard(boardId: number, userId: string) {
	return prisma.board.delete({
		where: {
			id: boardId,
			userId
		}
	});
}
