import prisma from '$lib/prisma';

export async function getBoards(userId: string) {
	return prisma.board.findMany({
		where: {
			userId: userId
		}
	});
}

export async function createBoard(userId: string, name: string, color: string) {
	return prisma.board.create({
		data: {
			name,
			color,
			User: {
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
