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
			attachments: true,
			cover: true
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

export async function makeCover(itemId: string, attachmentId: string, userId: string) {
	const attachment = await prisma.attachment.findFirst({
		where: { id: attachmentId, item: { board: { userId } } }
	});

	if (!attachment) {
		throw new Error('Attachment not found');
	}

	const existingCover = await prisma.item.findFirst({
		where: { cover: { itemId }, board: { userId } }
	});

	// Create a new cover if not existed
	if (!existingCover) {
		return prisma.cover.create({
			data: {
				itemId,
				attachmentId,
				url: attachment.url
			}
		});
	}

	// Update the existing cover
	return prisma.cover.update({
		where: { itemId },
		data: { attachmentId, url: attachment.url }
	});
}
