import { column } from '$lib/drizzle/schema';
import { createInsertSchema } from 'drizzle-zod';

export const insertColumnSchema = createInsertSchema(column, {
	order: (schema) => schema.order.optional()
});

export const updateColumnNameSchema = createInsertSchema(column, {
	id: (schema) => schema.id,
	name: (schema) => schema.name
}).pick({ id: true, name: true });

export const copyColumnSchema = createInsertSchema(column, {
	id: (schema) => schema.id,
	name: (schema) => schema.name
}).pick({ id: true, name: true });

export const deleteColumnSchema = createInsertSchema(column, {
	id: (schema) => schema.id
}).pick({ id: true });

export const updateColumnOrderSchema = createInsertSchema(column, {
	order: (schema) => schema.order
}).pick({ order: true });
