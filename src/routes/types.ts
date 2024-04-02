import type { Prisma } from '@prisma/client';

export type BoardWithColumns = Prisma.BoardGetPayload<{
	include: {
		columns: {
			include: {
				items: true;
			};
		};
	};
}>;

export type ItemWithColumn = Prisma.ItemGetPayload<{
	include: {
		column: true;
		cover: true;
	};
}>;

export type ItemWithCoverAndAttachments = Prisma.ItemGetPayload<{
	include: {
		cover: true;
		attachments: true;
	};
}>;

export type ColumnWithItems = Prisma.ColumnGetPayload<{
	include: {
		items: true;
	};
}>;
