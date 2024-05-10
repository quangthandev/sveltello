import { createQuery } from '@tanstack/svelte-query';
import type { Board, BoardWithColumns } from '$lib/types';

const BASE_URL = '/boards';

export const useBoards = (initialData: Board[] = []) =>
	createQuery<BoardWithColumns[]>({
		queryKey: ['boards'],
		queryFn: async () => {
			const res = await fetch(BASE_URL);

			if (!res.ok) {
				throw new Error('Failed to fetch boards');
			}

			return await res.json();
		},
		initialData: initialData.map((board) => ({ ...board, columns: [] }))
	});

export const useBoard = (id: number, initialData?: BoardWithColumns) => {
	const queryFn = async () => {
		const res = await fetch(`${BASE_URL}/${id}`);

		if (!res.ok) {
			throw new Error('Failed to fetch board');
		}

		return await res.json();
	};

	if (!initialData) {
		return createQuery<BoardWithColumns>({
			queryKey: ['boards', id],
			queryFn
		});
	}

	return createQuery<BoardWithColumns>({
		queryKey: ['boards', id],
		queryFn,
		initialData
	});
};
