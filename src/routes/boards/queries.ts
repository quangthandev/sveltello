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

export async function createBoard(
	userId: string,
	name: string,
	color: string,
	imageId?: string,
	imageThumbUrl?: string,
	imageFullUrl?: string,
	imageUserName?: string,
	imageLinkHTML?: string
) {
	return prisma.board.create({
		data: {
			name,
			color,
			imageId,
			imageThumbUrl,
			imageFullUrl,
			imageUserName,
			imageLinkHTML,
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
