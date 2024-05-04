import { cover, item } from '$lib/drizzle/schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const createItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	columnId: z.string(),
	order: z.coerce.number(),
	boardId: z.number()
});

export const updateItemTitleSchema = createInsertSchema(item, {
	title: (schema) => schema.title
}).pick({ title: true });

export const updateItemContentSchema = createInsertSchema(item, {
	content: (schema) => schema.content.optional()
}).pick({ content: true });

export const moveItemToColumnSchema = createInsertSchema(item, {
	columnId: (schema) => schema.columnId
}).pick({ columnId: true });

export const moveOrCopyItemToDestinationSchema = createInsertSchema(item, {
	boardId: z.coerce.number(),
	columnId: (schema) => schema.columnId,
	title: (schema) => schema.title
})
	.extend({
		posIndex: z.coerce.number()
	})
	.pick({ boardId: true, columnId: true, title: true, posIndex: true });

export const makeCoverFromAttachmentSchema = createInsertSchema(cover, {
	attachmentId: z.string()
}).pick({ attachmentId: true });

export const makeCoverFromUnsplashSchema = z.object({
	url: z.string()
});
