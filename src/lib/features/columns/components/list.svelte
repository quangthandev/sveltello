<script lang="ts">
	import IconPlus from '$lib/components/icons/icon-plus.svelte';
	import type { Column, ItemWithCoverAndAttachments } from '$lib/types';
	import NewItem from '$lib/features/items/components/new-item.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import ListTitle from './list-title.svelte';
	import ListActionsMenu from './list-actions-menu.svelte';
	import ListDropzone from './list-dropzone.svelte';

	export let boardName: string;
	export let boardId: number;
	export let column: Column & { items: ItemWithCoverAndAttachments[] };

	$: ({ id, name, items } = column);

	let editing: boolean = false;
</script>

<li
	class="flex-shrink-0 flex flex-col gap-1 overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-neutral-50"
>
	<header class="p-2 flex justify-between items-center">
		<h2 class="w-full"><ListTitle {id} {name} {boardId} /></h2>
		<ListActionsMenu {id} {name} {boardId} on:addCard={() => (editing = true)} />
	</header>

	<ListDropzone {id} {boardName} {boardId} {items} />

	{#if editing}
		<NewItem
			{boardId}
			columnId={id}
			nextOrder={items.length === 0 ? 1 : items[items.length - 1].order + 1}
			on:complete={() => (editing = false)}
		/>
	{:else}
		<div class="p-2">
			<Button
				variant="ghost"
				on:click={() => (editing = true)}
				aria-label="Add a card"
				class="flex justify-start items-center gap-2 w-full text-muted-foreground"
			>
				<IconPlus />
				Add a card
			</Button>
		</div>
	{/if}
</li>
