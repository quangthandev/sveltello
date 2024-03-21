import { createContext } from '$lib/context';
import type { CreateMutationResult } from '@tanstack/svelte-query';

type ItemQueriesContext = {
	uploadImage: CreateMutationResult<
		{ url: string },
		unknown,
		{ itemId: string; file: File },
		unknown
	>;
	deleteAttachment: (itemId: string) => CreateMutationResult<unknown, unknown, string, unknown>;
};

export const queriesCtx = createContext<ItemQueriesContext>();
