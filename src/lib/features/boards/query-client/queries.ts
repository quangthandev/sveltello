import { createQuery } from '@tanstack/svelte-query';
import type { Board, BoardWithColumns } from '$lib/types';

export const useBoards = (initialData: Board[] = []) =>
	createQuery<BoardWithColumns[]>({
		queryKey: ['boards'],
		queryFn: async () => (await fetch('/boards')).json(),
		initialData: initialData.map((board) => ({ ...board, columns: [] }))
	});

export const useBoard = (id: number, initialData?: BoardWithColumns) => {
	if (!initialData) {
		return createQuery<BoardWithColumns>({
			queryKey: ['boards', id],
			queryFn: async () => (await fetch(`/boards/${id}`)).json()
		});
	}

	return createQuery<BoardWithColumns>({
		queryKey: ['boards', id],
		queryFn: async () => (await fetch(`/boards/${id}`)).json(),
		initialData
	});
};
