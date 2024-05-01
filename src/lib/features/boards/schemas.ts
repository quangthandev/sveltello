import { board } from '$lib/drizzle/schema';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const createBoardSchema = createInsertSchema(board, {
	name: (schema) => schema.name,
	color: (schema) => schema.color,
	imageId: (schema) => schema.imageId.optional(),
	imageThumbUrl: (schema) => schema.imageThumbUrl.optional(),
	imageFullUrl: (schema) => schema.imageFullUrl.optional(),
	imageUsername: (schema) => schema.imageUsername.optional(),
	imageLinkHtml: (schema) => schema.imageLinkHtml.optional(),
	imageAltDescription: (schema) => schema.imageAltDescription.optional(),
	userId: (schema) => schema.userId.optional()
});

export const updateBoardNameSchema = createInsertSchema(board, {
	id: z.coerce.number(),
	name: (schema) => schema.name
}).pick({ id: true, name: true });

export const deleteBoardSchema = updateBoardNameSchema.pick({ id: true });
