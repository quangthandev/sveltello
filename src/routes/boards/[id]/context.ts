import { createContext } from '$lib/context';
import type { CreateMutationResult } from '@tanstack/svelte-query';

export type MutationData = {
	id: string;
	title: string;
	order: number;
	columnId: string;
	boardId: number;
};

type BoardQueriesContext = {
	createItem: CreateMutationResult<unknown, unknown, MutationData, unknown>;
	updateItem: CreateMutationResult<unknown, unknown, MutationData, unknown>;
	deleteItem: CreateMutationResult<unknown, unknown, string>;
};

export const queriesCtx = createContext<BoardQueriesContext>();
