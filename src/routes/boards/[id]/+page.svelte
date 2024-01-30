<script lang="ts">
	import type { PageData } from './$types';
	import Column from './Column.svelte';
	import EditableText from './EditableText.svelte';
	import NewColumn from './NewColumn.svelte';

	export let data: PageData;

	$: itemsById = new Map(data.board.items.map((item) => [item.id, item]));

	type Column = (typeof data.board.columns)[number];
	type ColumnWithItems = Column & { items: typeof data.board.items };

	$: columns = mapColumns(itemsById);

	function mapColumns(
		itemsById: Map<
			string,
			{
				id: string;
				title: string;
				content: string | null;
				order: number;
				columnId: string;
				boardId: number;
			}
		>
	) {
		const columns = new Map<string, ColumnWithItems>();
		for (let column of [...data.board.columns]) {
			columns.set(column.id, { ...column, items: [] });
		}

		// add items to their columns
		for (let item of itemsById.values()) {
			let columnId = item.columnId;
			let column = columns.get(columnId);
			column && column.items.push(item);
		}

		return columns;
	}
</script>

<div
	class="h-full min-h-0 flex flex-col overflow-x-scroll"
	style:background-color={data.board.color}
>
	<h1 class="">
		<EditableText
			action="?/updateBoardName"
			value={data.board.name}
			fieldName="name"
			inputClassName="mx-8 my-4 text-2xl font-medium border border-slate-400 rounded-lg py-1 px-2 text-black"
			buttonClassName="mx-8 my-4 text-2xl font-medium block rounded-lg text-left border border-transparent py-1 px-2 text-slate-800"
		>
			<input type="hidden" name="id" value={data.board.id} />
		</EditableText>
	</h1>
	<div class="flex flex-grow min-h-0 h-full items-start gap-4 px-8 pb-4">
		{#each [...columns.values()] as column (column.id)}
			<Column name={column.name} columnId={column.id} items={column.items} />
		{/each}

		<NewColumn boardId={data.board.id} />
	</div>
</div>
