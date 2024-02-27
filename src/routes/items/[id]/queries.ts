import prisma from '$lib/server/prisma';

export function getItem(id: string, userId: string) {
	return prisma.item.findUnique({
		where: {
			id,
			Board: {
				userId
			}
		},
		include: {
			Column: true
		}
	});
}

export function updateItemTitle(id: string, title: string, userId: string) {
	return prisma.item.update({
		where: { id, Board: { userId } },
		data: { title }
	});
}

export function updateItemContent(id: string, content: string, userId: string) {
	return prisma.item.update({
		where: { id, Board: { userId } },
		data: { content }
	});
}
