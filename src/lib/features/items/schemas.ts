import { z } from 'zod';

export const createItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	columnId: z.string(),
	order: z.union([z.string(), z.number()]).transform((val) => Number(val)),
	boardId: z.number()
});
