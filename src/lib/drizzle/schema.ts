import { sqliteTable, text, real, integer, uniqueIndex, numeric } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { generateId } from 'lucia';

export const session = sqliteTable('Session', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateId(15)),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	expiresAt: numeric('expires_at').notNull(),
	createdAt: numeric('created_at')
		.$defaultFn(() => new Date().toISOString())
		.notNull(),
	updatedAt: numeric('updated_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const column = sqliteTable('Column', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateId(15)),
	name: text('name').notNull(),
	order: real('order').notNull(),
	boardId: integer('board_id')
		.notNull()
		.references(() => board.id, { onDelete: 'cascade', onUpdate: 'cascade' })
});

export const columnRelations = relations(column, ({ one, many }) => ({
	board: one(board, { fields: [column.boardId], references: [board.id] }),
	items: many(item)
}));

export const user = sqliteTable(
	'User',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.$defaultFn(() => generateId(15)),
		email: text('email').notNull(),
		password: text('password').notNull()
	},
	(table) => {
		return {
			emailKey: uniqueIndex('User_email_key').on(table.email)
		};
	}
);

export const item = sqliteTable('Item', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateId(15)),
	title: text('title').notNull(),
	content: text('content'),
	order: real('order').notNull(),
	columnId: text('column_id')
		.notNull()
		.references(() => column.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	boardId: integer('board_id')
		.notNull()
		.references(() => board.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	createdAt: text('created_at')
		.$defaultFn(() => new Date().toISOString())
		.notNull(),
	updatedAt: text('updated_at')
		.notNull()
		.$defaultFn(() => new Date().toISOString())
});

export const itemRelations = relations(item, ({ one, many }) => ({
	board: one(board, { fields: [item.boardId], references: [board.id] }),
	column: one(column, { fields: [item.columnId], references: [column.id] }),
	attachments: many(attachment),
	cover: one(cover, { fields: [item.id], references: [cover.itemId] })
}));

export const board = sqliteTable('Board', {
	id: integer('id').primaryKey({ autoIncrement: true }).notNull(),
	name: text('name').notNull(),
	color: text('color').default('#e0e0e0').notNull(),
	imageId: text('image_id'),
	imageThumbUrl: text('image_thumb_url'),
	imageFullUrl: text('image_full_url'),
	imageUsername: text('image_username'),
	imageLinkHtml: text('image_link_HTML'),
	imageAltDescription: text('image_alt_description'),
	createdAt: text('created_at')
		.$defaultFn(() => new Date().toISOString())
		.notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'restrict', onUpdate: 'cascade' })
});

export const boardRelations = relations(board, ({ many }) => ({
	columns: many(column),
	items: many(item)
}));

export const cover = sqliteTable(
	'Cover',
	{
		id: text('id')
			.primaryKey()
			.notNull()
			.$defaultFn(() => generateId(15)),
		color: text('color'),
		url: text('url'),
		itemId: text('item_id')
			.notNull()
			.references(() => item.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		attachmentId: text('attachment_id').references(() => attachment.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		}),
		createdAt: text('created_at')
			.$defaultFn(() => new Date().toISOString())
			.notNull(),
		updatedAt: text('updated_at')
			.$defaultFn(() => new Date().toISOString())
			.notNull()
	},
	(table) => {
		return {
			attachmentIdKey: uniqueIndex('Cover_attachmentId_key').on(table.attachmentId),
			itemIdKey: uniqueIndex('Cover_itemId_key').on(table.itemId)
		};
	}
);

export const attachment = sqliteTable('Attachment', {
	id: text('id')
		.primaryKey()
		.notNull()
		.$defaultFn(() => generateId(15)),
	name: text('name').notNull(),
	type: text('type').notNull(),
	url: text('url').notNull(),
	itemId: text('item_id')
		.notNull()
		.references(() => item.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	createdAt: text('created_at')
		.$defaultFn(() => new Date().toISOString())
		.notNull(),
	updatedAt: text('updated_at')
		.$defaultFn(() => new Date().toISOString())
		.notNull()
});

export const attachmentRelations = relations(attachment, ({ one }) => ({
	item: one(item, { fields: [attachment.itemId], references: [item.id] })
}));
