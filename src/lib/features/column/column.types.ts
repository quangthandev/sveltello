import type { column } from '$lib/drizzle/schema';

export type ColumnUpdateOrderData = Pick<typeof column.$inferSelect, 'id' | 'order'>;
