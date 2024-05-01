<script lang="ts">
	import { tick } from 'svelte';
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
	let listEl: HTMLOListElement;

	function scrollList() {
		if (listEl) {
			listEl.scrollTop = listEl.scrollHeight;
		}
	}
</script>

<li
	class="flex-shrink-0 flex flex-col gap-1 overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-neutral-50"
>
	<header class="p-2 flex justify-between items-center">
		<h2><ListTitle {id} {name} {boardId} /></h2>
		<ListActionsMenu {id} {name} onAddCard={() => (editing = true)} />
	</header>

	<ListDropzone {id} {boardName} {boardId} {items} />

	{#if editing}
		<NewItem
			{boardId}
			columnId={id}
			nextOrder={items.length === 0 ? 1 : items[items.length - 1].order + 1}
			on:create={async () => {
				await tick();
				scrollList();
			}}
			on:complete={() => (editing = false)}
		/>
	{:else}
		<div class="p-2">
			<Button
				variant="ghost"
				on:click={async () => {
					editing = true;
					await tick();
					scrollList();
				}}
				aria-label="Add a card"
				class="flex justify-start items-center gap-2 w-full text-muted-foreground"
			>
				<IconPlus />
				Add a card
			</Button>
		</div>
	{/if}
</li>
