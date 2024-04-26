<script lang="ts">
	import EditableText from '$lib/components/shared/editable-text.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { BoardWithColumns } from '$lib/types';

	export let id: string;
	export let name: string;
	export let boardId: number;

	const queryClient = useQueryClient();

	const handleSubmit = () => {
		const prevBoardData = queryClient.getQueryData<BoardWithColumns>(['boards', boardId]);

		if (prevBoardData) {
			queryClient.setQueryData(['boards', boardId], {
				...prevBoardData,
				columns: prevBoardData.columns.map((column) =>
					column.id === id ? { ...column, name } : column
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
	on:submitting={handleSubmit}
	on:submitted={() => {
		queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
	}}
>
	<input type="hidden" name="id" value={id} />
</EditableText>
