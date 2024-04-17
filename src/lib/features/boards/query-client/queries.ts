import { createQuery } from '@tanstack/svelte-query';
import type { BoardWithColumns } from '$lib/types';

export const useBoards = (initialData: BoardWithColumns[]) =>
	createQuery<BoardWithColumns[]>({
		queryKey: ['boards'],
		queryFn: async () => (await fetch('/boards')).json(),
		initialData
	});

export const useBoard = (id: number, initialData?: BoardWithColumns) =>
	createQuery<BoardWithColumns>({
		queryKey: ['boards', id],
		queryFn: async () => (await fetch(`/boards/${id}`)).json(),
		initialData: initialData!
	});
