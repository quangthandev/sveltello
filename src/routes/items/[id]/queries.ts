import prisma from '$lib/server/prisma';

export function getItem(id: string, userId: string) {
	return prisma.item.findUnique({
		where: {
			id,
			board: {
				userId
			}
		},
		include: {
			column: true,
			attachments: true
		}
	});
}

export function updateItemTitle(id: string, title: string, userId: string) {
	return prisma.item.update({
		where: { id, board: { userId } },
		data: { title }
	});
}

export function updateItemContent(id: string, content: string, userId: string) {
	return prisma.item.update({
		where: { id, board: { userId } },
		data: { content }
	});
}

export function createAttachment(itemId: string, name: string, type: string, url: string) {
	return prisma.attachment.create({
		data: {
			itemId,
			name,
			type,
			url
		}
	});
}

export function deleteAttachment(id: string, userId: string) {
	return prisma.attachment.delete({
		where: { id, item: { board: { userId } } }
	});
}
