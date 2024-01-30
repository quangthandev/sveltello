export const CONTENT_TYPES = {
	card: 'application/svelte-card',
	column: 'application/svelte-column'
};

export const ItemMutationFields = {
	id: { type: String, name: 'id' },
	columnId: { type: String, name: 'columnId' },
	order: { type: Number, name: 'order' },
	title: { type: String, name: 'title' }
} as const;

export type ItemMutation = MutationFromFields<typeof ItemMutationFields>;

////////////////////////////////////////////////////////////////////////////////
// Bonkers TypeScript
type ConstructorToType<T> = T extends typeof String
	? string
	: T extends typeof Number
		? number
		: never;

export type MutationFromFields<
	T extends Record<string, { type: StringConstructor | NumberConstructor; name: string }>
> = {
	[K in keyof T]: ConstructorToType<T[K]['type']>;
};

export type AcceptDrop = 'none' | 'top' | 'bottom';
