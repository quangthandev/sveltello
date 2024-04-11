import { createQuery } from '@tanstack/svelte-query';
import type { BoardWithColumns } from '$lib/types';

const useBoards = (initialData: BoardWithColumns[]) =>
	createQuery<BoardWithColumns[]>({
		queryKey: ['boards'],
		queryFn: async () => (await fetch('/boards')).json(),
		initialData
	});

export default useBoards;
