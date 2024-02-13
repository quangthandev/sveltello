<script lang="ts">
	import { page } from '$app/stores';
	import type { Board, Item } from '@prisma/client';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { queriesCtx, type MutationData } from './context';
	import { writable } from 'svelte/store';

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

	const queryClient = useQueryClient();

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
			const prevBoardData = queryClient.getQueryData<Board & { items: Item[] }>([
				'boards',
				boardId
			]);

			if (prevBoardData) {
				queryClient.setQueryData(['boards', boardId], {
					...prevBoardData,
					items: [...prevBoardData.items, data]
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

			const prevBoardData = queryClient.getQueryData<Board & { items: Omit<Item, 'content'>[] }>([
				'boards',
				boardId
			]);

			if (prevBoardData) {
				queryClient.setQueryData(['boards', boardId], {
					...prevBoardData,
					items: prevBoardData.items.map((item) => {
						if (item.id === data.id) {
							return {
								...item,
								...data
							};
						}

						return item;
					})
				});
			}

			return { prevBoardData };
		},
		onError: (_err, _variables, context: any) => {
			if (context?.prevBoardData) {
				queryClient.setQueryData(['boards', boardId], context.prevBoardData);
			}
		},
		onSettled: (_data, _err, variables) => {
			if ($pendingUpdates.has(variables.id)) {
				$pendingUpdates.delete(variables.id);
			} else {
				queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
			}
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
			const prevBoardData = queryClient.getQueryData<Board & { items: Omit<Item, 'content'>[] }>([
				'boards',
				boardId
			]);

			if (prevBoardData) {
				queryClient.setQueryData(['boards', boardId], {
					...prevBoardData,
					items: prevBoardData.items.filter((item) => item.id !== id)
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

	queriesCtx.set({
		createItem,
		updateItem,
		deleteItem
	});
</script>

<slot />
