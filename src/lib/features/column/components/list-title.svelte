<script lang="ts">
	import EditableText from '$lib/components/shared/editable-text.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { BoardWithColumns } from '$lib/types';

	interface Props {
		id: string;
		name: string;
		boardId: number;
	}

	let { id, name, boardId }: Props = $props();

	const queryClient = useQueryClient();

	const handleSubmit = (data: FormDataEntryValue | null) => {
		const prevBoardData = queryClient.getQueryData<BoardWithColumns>(['boards', boardId]);

		if (prevBoardData && data) {
			queryClient.setQueryData(['boards', boardId], {
				...prevBoardData,
				columns: prevBoardData.columns.map((column) =>
					column.id === id ? { ...column, name: data } : column
				)
			});
		}
	};
</script>

<EditableText
	action="?/updateColumnName"
	fieldName="name"
	value={name}
	class="w-full"
	inputClassName="w-full"
	buttonClassName="block text-left w-full"
	onSubmitting={handleSubmit}
	onSubmitted={() => {
		queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
	}}
>
	<input type="hidden" name="id" value={id} />
</EditableText>
