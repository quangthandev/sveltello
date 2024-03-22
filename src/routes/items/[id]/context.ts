import { createContext } from '$lib/context';
import type { CreateMutationResult } from '@tanstack/svelte-query';

export type MutationData = {
	id: string;
	title: string;
	order: number;
	columnId: string;
	boardId: number;
};

type ItemQueriesContext = {
	createItem: CreateMutationResult<unknown, unknown, MutationData, unknown>;
	updateItem: CreateMutationResult<unknown, unknown, MutationData, unknown>;
	deleteItem: CreateMutationResult<unknown, unknown, string>;
	uploadImage: CreateMutationResult<
		{ url: string },
		unknown,
		{ itemId: string; file: File },
		unknown
	>;
	deleteAttachment: (itemId: string) => CreateMutationResult<unknown, unknown, string, unknown>;
};

export const queriesCtx = createContext<ItemQueriesContext>();
