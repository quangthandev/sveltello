import prisma from '$lib/server/prisma';

export async function getColumn(id: string, userId: string) {
	return prisma.column.findUnique({
		where: {
			id,
			board: {
				userId
			}
		},
		include: {
			items: {
				orderBy: {
					order: 'asc'
				}
			}
		}
	});
}
