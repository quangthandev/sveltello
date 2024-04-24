import type { attachment, board, column, cover, item } from '$lib/drizzle/schema';

export type Board = typeof board.$inferSelect;
export type Column = typeof column.$inferSelect;
export type Item = typeof item.$inferSelect;
export type Attachment = typeof attachment.$inferSelect;
export type Cover = typeof cover.$inferSelect;

export interface BoardWithColumns extends Board {
	columns: (Column & { items: ItemWithCoverAndAttachments[] })[];
}

export interface ItemWithColumn extends Item {
	column: Column;
}
export interface ItemFullPayload extends Item {
	board: Board;
	column: Column;
	cover: Cover | null;
	attachments: (Attachment & { isCover: boolean })[];
}
export interface ItemWithCoverAndAttachments extends Item {
	cover: Cover | null;
	attachments: Attachment[];
}
export interface ItemWithAttachments extends Item {
	attachments: Attachment[];
}
export type ItemMutation = Required<
	Omit<typeof item.$inferInsert, 'content' | 'createdAt' | 'updatedAt'>
>;

export interface ColumnWithItems extends Column {
	items: Item[];
}
export type ColumnMutation = Omit<typeof column.$inferInsert, 'order' | 'createdAt' | 'updatedAt'>;
