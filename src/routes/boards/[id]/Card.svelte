<script lang="ts">
	import { enhance } from '$app/forms';
	import { draggable, droppable } from './actions';
	import { invalidateAll } from '$app/navigation';
	import { createEventDispatcher } from 'svelte';
	import type { ActionData } from '../$types';

	export let title: string;
	export let content: string | null;
	export let id: string;
	export let columnId: string;
	export let order: number;
	export let nextOrder: number;
	export let previousOrder: number;

	type AcceptDrop = 'none' | 'top' | 'bottom';
	let acceptDrop: AcceptDrop = 'none';

	let listItemEl: HTMLLIElement;

	const dispatch = createEventDispatcher();
</script>

<li
	bind:this={listItemEl}
	use:droppable
	on:dragOver={(event) => {
		const rect = listItemEl.getBoundingClientRect();
		const midpoint = (rect.top + rect.bottom) / 2;
		acceptDrop = event.detail.clientY <= midpoint ? 'top' : 'bottom';
	}}
	on:dragLeave={() => (acceptDrop = 'none')}
	on:dropItem={async (event) => {
		const transfer = event.detail;

		const droppedOrder = acceptDrop === 'top' ? previousOrder : nextOrder;
		const moveOrder = (droppedOrder + order) / 2;

		const mutation = {
			order: moveOrder,
			columnId: columnId,
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

		acceptDrop = 'none';
	}}
	class={'border-t-2 border-b-2 -mb-[2px] last:mb-0 cursor-grab active:cursor-grabbing px-2 py-1 ' +
		(acceptDrop === 'top'
			? 'border-t-red-500 border-b-transparent'
			: acceptDrop === 'bottom'
				? 'border-b-red-500 border-t-transparent'
				: 'border-t-transparent border-b-transparent')}
>
	<div
		draggable="true"
		class="bg-white shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 relative"
		use:draggable={{ id, title }}
	>
		<h3>{title}</h3>
		{#if content}
			<div class="mt-2">{content}</div>
		{:else}
			<span>&nbsp;</span>
		{/if}
		<form
			method="post"
			action="?/deleteCard"
			use:enhance={() => {
				dispatch('deleting', { id });

				return async ({ update }) => {
					await update();
					dispatch('deleted', { id });
				};
			}}
		>
			<input type="hidden" name="itemId" value={id} />
			<button
				aria-label="Delete card"
				class="absolute top-4 right-4 text-gray-400 hover:text-red-500"
				type="submit"
				on:click={(event) => {
					event.stopPropagation();
				}}
			>
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						fill="currentColor"
					>
						<title>delete</title>
						<path
							d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
						/>
					</svg>
				</span>
			</button>
		</form>
	</div>
</li>
