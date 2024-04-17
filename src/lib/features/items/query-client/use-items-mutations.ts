import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { Attachment, BoardWithColumns, ItemMutation, ItemWithAttachments } from '$lib/types';

export const useCreateItem = (boardId: number) => {
	const queryClient = useQueryClient();

	return createMutation<
		BoardWithColumns,
		Error,
		ItemMutation,
		{ prevBoardData: BoardWithColumns | undefined }
	>({
		mutationFn: async (data) =>
			(
				await fetch(`/items`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				})
			).json(),
		onMutate: async (data) => {
			const prevBoardData = queryClient.getQueryData<BoardWithColumns>(['boards', boardId]);

			if (prevBoardData) {
				queryClient.setQueryData<BoardWithColumns>(['boards', boardId], {
					...prevBoardData,
					columns: prevBoardData.columns.map((column) => {
						if (column.id === data.columnId) {
							return {
								...column,
								items: [
									...column.items,
									{
										...data,
										content: '',
										cover: null,
										attachments: [],
										createdAt: new Date().toISOString(),
										updatedAt: new Date().toISOString()
									}
								]
							};
						}

						return column;
					})
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
			queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
		}
	});
};

export const useUpdateItem = (boardId: number) => {
	const queryClient = useQueryClient();

	return createMutation<unknown, Error, ItemMutation>({
		mutationFn: async (data) => {
			const response = await fetch(`/items/${data.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			return response.json();
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ['boards', boardId] });
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
		}
	});
};

export const useDeleteItem = (boardId: number) => {
	const queryClient = useQueryClient();

	return createMutation<unknown, Error, string, { prevBoardData: BoardWithColumns | undefined }>({
		mutationFn: async (id) =>
			(
				await fetch(`/items/${id}`, {
					method: 'DELETE'
				})
			).json(),
		onMutate: async (id) => {
			const prevBoardData = queryClient.getQueryData<BoardWithColumns>(['boards', boardId]);

			if (prevBoardData) {
				queryClient.setQueryData(['boards', boardId], {
					...prevBoardData,
					columns: prevBoardData.columns.map((column) => ({
						...column,
						items: column.items.filter((item) => item.id !== id)
					}))
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
			queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
		}
	});
};

export const useMoveItem = ({
	id,
	boardId,
	onMutate,
	onSettled
}: {
	id: string;
	boardId: number;
	onMutate?: () => void;
	onSettled?: () => void;
}) => {
	const queryClient = useQueryClient();

	return createMutation<unknown, unknown, string>({
		mutationFn: async (columnId) => {
			const res = await fetch(`/items/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ columnId: columnId })
			});
			return res.json();
		},
		onMutate,
		onSettled: () => {
			onSettled?.();

			queryClient.invalidateQueries({
				queryKey: ['boards', boardId]
			});
		}
	});
};

export const useUploadImage = () =>
	createMutation<{ url: string }, unknown, { itemId: string; file: File }>({
		mutationFn: async ({ itemId, file }) => {
			// Limit file size to 4.5MB due to Vercel's serverless function payload limit
			if (file.size > 4.5 * 1024 * 1024) {
				alert('File size is too large. Please upload a file smaller than 4.5MB');
				return;
			}

			const formData = new FormData();
			formData.append('file', file);

			const res = await fetch(`/items/${itemId}/upload`, {
				method: 'POST',
				body: formData
			});
			return await res.json();
		}
	});

export const useDeleteAttachment = (itemId: string) => {
	const queryClient = useQueryClient();

	return createMutation<unknown, unknown, string, { prevAttachments: Attachment[] }>({
		mutationFn: async (id) =>
			(
				await fetch(`/api/attachments/${id}`, {
					method: 'DELETE'
				})
			).json(),
		onMutate: async (id) => {
			const item = queryClient.getQueryData<ItemWithAttachments>(['items', itemId]);

			if (!item) return;

			const newAttachments = item.attachments.filter((attachment) => attachment.id !== id);

			queryClient.setQueryData(['items', itemId], {
				...item,
				attachments: newAttachments
			});

			return { prevAttachments: item.attachments };
		},
		onError: (_err, _variables, context) => {
			if (context?.prevAttachments) {
				const item = queryClient.getQueryData<ItemWithAttachments>(['items', itemId]);

				queryClient.setQueryData(['items', itemId], {
					...item,
					attachments: context.prevAttachments
				});
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['items', itemId] });
		}
	});
};
