<script lang="ts">
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { queriesCtx } from './context';
	import type { Attachment, Item } from '@prisma/client';

	const queryClient = useQueryClient();

	const uploadImage = createMutation<{ url: string }, unknown, { itemId: string; file: File }>({
		mutationFn: async ({ itemId, file }) => {
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

	queriesCtx.set({ uploadImage, deleteAttachment });
</script>

<slot />
