import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { ColumnMutationData } from '../types';
import type { Board, Column, ColumnMutation } from '$lib/types';
import type { WithOptional } from '$lib/utils';

type BoardWithColumns = Board & { columns: WithOptional<Column, 'order'>[] };

export const useCreateColumn = (boardId: number) => {
	const queryClient = useQueryClient();

	return createMutation<
		unknown,
		unknown,
		ColumnMutation,
		{ prevBoardData: BoardWithColumns | undefined }
	>({
		mutationFn: async (data) => {
			await fetch('/api/columns', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
		},
		onMutate: async ({ id, name }) => {
			const prevBoardData = queryClient.getQueryData<BoardWithColumns>(['boards', boardId]);

			if (prevBoardData) {
				queryClient.setQueryData(['boards', boardId], {
					...prevBoardData,
					columns: [
						...prevBoardData.columns,
						{
							id,
							name,
							boardId,
							items: []
						}
					]
				});
			}

			return { prevBoardData };
		},
		onError: (_err, _variables, context) => {
			if (context?.prevBoardData) {
				queryClient.setQueryData(['boards', boardId], context.prevBoardData);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['boards', boardId]
			});
		}
	});
};

export const useUpdateColumnOrder = (boardId: number) => {
	const queryClient = useQueryClient();

	return createMutation<unknown, unknown, ColumnMutationData>({
		mutationFn: async (data) => {
			const res = await fetch(`/columns/${data.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ order: data.order })
			});
			return res.json();
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
		}
	});
};
