<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { queriesCtx, type MutationData } from './context';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	import type { Attachment, Board, Column, Item } from '../../types';

	const queryClient = useQueryClient();

	$: boardId = $page.params.id;

	// Store pending update requests to abort later when item is moved around quickly
	const pendingUpdates = writable(
		new Map<
			string,
			{
				controller: AbortController;
				signal: AbortSignal;
			}
		>()
	);

	const createItem = createMutation<unknown, unknown, MutationData>({
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
			const prevBoardData = queryClient.getQueryData<
				Board & { items: Item[]; columns: (Column & { items: Item[] })[] }
			>(['boards', boardId]);

			if (prevBoardData) {
				queryClient.setQueryData(['boards', boardId], {
					...prevBoardData,
					columns: prevBoardData.columns.map((column) => {
						if (column.id === data.columnId) {
							return {
								...column,
								items: [...column.items, data]
							};
						}

						return column;
					})
				});
			}

			return { prevBoardData };
		},
		onError: (_err: any, _variables: any, context: any) => {
			if (context?.prevBoardData) {
				queryClient.setQueryData(['boards', boardId], context.prevBoardData);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
		}
	});

	const updateItem = createMutation<unknown, unknown, MutationData>({
		mutationFn: async (data) =>
			(
				await fetch(`/items/${data.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data),
					signal: $pendingUpdates.get(data.id)?.signal
				})
			).json(),
		onMutate: async (data) => {
			// Abort pending update request associated with item id if existed
			if ($pendingUpdates.has(data.id)) {
				$pendingUpdates.get(data.id)?.controller.abort();
			}

			// Store new pending update request controller and signal
			const controller = new AbortController();

			$pendingUpdates.set(data.id, {
				controller: controller,
				signal: controller.signal
			});

			await queryClient.cancelQueries({ queryKey: ['boards', boardId] });
		},
		onSettled: (_data, _err, variables) => {
			if ($pendingUpdates.has(variables.id)) {
				$pendingUpdates.delete(variables.id);
			}

			queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
		}
	});

	const deleteItem = createMutation<unknown, unknown, string>({
		mutationFn: async (id) =>
			(
				await fetch(`/items/${id}`, {
					method: 'DELETE'
				})
			).json(),
		onMutate: async (id) => {
			const prevBoardData = queryClient.getQueryData<
				Board & { items: Omit<Item, 'content'>[]; columns: (Column & { items: Item[] })[] }
			>(['boards', boardId]);

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
		onError: (_err, _variables, context: any) => {
			if (context?.prevBoardData) {
				queryClient.setQueryData(['boards', boardId], context.prevBoardData);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
		}
	});

	const uploadImage = createMutation<{ url: string }, unknown, { itemId: string; file: File }>({
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

	const deleteAttachment = (itemId: string) =>
		createMutation<unknown, unknown, string>({
			mutationFn: async (id) =>
				(
					await fetch(`/api/attachments/${id}`, {
						method: 'DELETE'
					})
				).json(),
			onMutate: async (id) => {
				const item = queryClient.getQueryData<Item & { attachments: Attachment[] }>([
					'items',
					itemId
				]);

				if (!item) return;

				const newAttachments = item.attachments.filter((attachment) => attachment.id !== id);

				queryClient.setQueryData(['items', itemId], {
					...item,
					attachments: newAttachments
				});

				return { prevAttachments: item.attachments };
			},
			onError: (_err, _variables, context: any) => {
				if (context?.prevAttachments) {
					const item = queryClient.getQueryData<Item & { attachments: Attachment[] }>([
						'items',
						itemId
					]);

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

	queriesCtx.set({ createItem, updateItem, deleteItem, uploadImage, deleteAttachment });
</script>

<slot />
