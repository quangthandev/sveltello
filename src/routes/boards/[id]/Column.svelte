<script lang="ts">
	import type { Item } from '@prisma/client';
	import EditableText from './EditableText.svelte';
	import Card from './Card.svelte';
	import NewCard from './NewCard.svelte';
	import { tick } from 'svelte';
	import { droppable } from './actions';
	import { invalidateAll } from '$app/navigation';
	import { flip } from 'svelte/animate';

	export let name: string;
	export let columnId: string;
	export let items: Item[];

	let acceptDrop = false;
	let editing: boolean = false;
	let listEl: HTMLOListElement;

	// for optimistic UI
	let deleting: string[] = [];

	$: sortedItems = items
		.filter((item) => !deleting.includes(item.id))
		.sort((a, b) => a.order - b.order);

	function scrollList() {
		if (listEl) {
			listEl.scrollTop = listEl.scrollHeight;
		}
	}
</script>

<div
	class={'flex-shrink-0 flex flex-col overflow-hidden max-h-full w-80 border-slate-400 rounded-xl shadow-sm shadow-slate-400 bg-slate-100 ' +
		(acceptDrop ? `outline outline-2 outline-red-500` : ``)}
	use:droppable={{ enabled: items.length === 0 }}
	on:dragOver={() => (acceptDrop = true)}
	on:dragLeave={() => {
		acceptDrop = false;
	}}
	on:dropItem={async (event) => {
		if (acceptDrop) {
			const transfer = event.detail;

			const mutation = {
				order: 1,
				columnId,
				id: transfer.id,
				title: transfer.title
			};

			await fetch('?/updateCard', {
				method: 'POST',
				body: JSON.stringify(mutation),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			invalidateAll();

			acceptDrop = false;
		}
	}}
>
	<div class="p-2">
		<EditableText
			action="?/updateColumnName"
			fieldName="name"
			value={name}
			inputClassName="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
			buttonClassName="block rounded-lg text-left w-full border border-transparent py-1 px-2 font-medium text-slate-600"
		>
			<input type="hidden" name="columnId" value={columnId} />
		</EditableText>
	</div>

	<ol bind:this={listEl} class="flex-grow overflow-auto">
		{#each sortedItems as item, index (item.id)}
			<li animate:flip={{ duration: 250 }}>
				<Card
					title={item.title}
					content={item.content}
					id={item.id}
					order={item.order}
					{columnId}
					previousOrder={sortedItems[index - 1] ? sortedItems[index - 1].order : 0}
					nextOrder={sortedItems[index + 1] ? sortedItems[index + 1].order : item.order + 1}
					on:deleting={(event) => (deleting = [...deleting, event.detail.id])}
					on:deleted={(event) => (deleting = deleting.filter((id) => id !== event.detail.id))}
				/>
			</li>
		{/each}
	</ol>

	{#if editing}
		<NewCard
			{columnId}
			nextOrder={sortedItems.length === 0 ? 1 : sortedItems[sortedItems.length - 1].order + 1}
			on:create={async () => {
				await tick();
				scrollList();
			}}
			on:complete={() => (editing = false)}
		/>
	{:else}
		<div class="p-2">
			<button
				type="button"
				on:click={async () => {
					editing = true;
					await tick();
					scrollList();
				}}
				class="flex items-center gap-2 rounded-lg text-left w-full p-2 font-medium text-slate-500 hover:bg-slate-200 focus:bg-slate-200"
			>
				<svg
					width="24"
					height="24"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<title>add</title>
					<path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
				</svg>
				Add a card
			</button>
		</div>
	{/if}
</div>
