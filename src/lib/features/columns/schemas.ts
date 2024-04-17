import { column } from '$lib/drizzle/schema';
import { createInsertSchema } from 'drizzle-zod';

export const insertColumnSchema = createInsertSchema(column, {
	order: (schema) => schema.order.optional()
});
