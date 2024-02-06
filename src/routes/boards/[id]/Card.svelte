<script lang="ts">
	import { page } from '$app/stores';
	import { draggable, droppable } from './actions';
	import type { AcceptDrop } from './types';
	import { queriesCtx } from './context';

	export let title: string;
	export let content: string | null;
	export let id: string;
	export let columnId: string;
	export let order: number;
	export let nextOrder: number;
	export let previousOrder: number;

	let acceptDrop: AcceptDrop = 'none';

	let droppableEl: HTMLDivElement;
	let draggedEl: HTMLDivElement | null;

	$: boardId = $page.params.id;

	const { updateItem, deleteItem } = queriesCtx.get();
</script>

<div
	bind:this={droppableEl}
	use:droppable
	on:dragOver={(event) => {
		// Do not accept drop if the current dragged element is the child of dropzone
		if (draggedEl && draggedEl.parentNode === droppableEl) {
			return (acceptDrop = 'none');
		}

		const rect = droppableEl.getBoundingClientRect();
		const midpoint = (rect.top + rect.bottom) / 2;
		acceptDrop = event.detail.clientY <= midpoint ? 'top' : 'bottom';
	}}
	on:dragLeave={() => (acceptDrop = 'none')}
	on:dropItem={(event) => {
		if (acceptDrop === 'none') {
			return;
		}

		const transfer = event.detail;

		const droppedOrder = acceptDrop === 'top' ? previousOrder : nextOrder;

		// Prevent API request if order has not been changed
		if (droppedOrder === transfer.order) {
			return (acceptDrop = 'none');
		}

		const moveOrder = (droppedOrder + order) / 2;

		const data = {
			order: moveOrder,
			columnId: columnId,
			id: transfer.id,
			title: transfer.title,
			boardId: parseInt(boardId)
		};

		$updateItem.mutate(data);

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
		use:draggable={{ id, columnId, title, order }}
		on:dragStart={(event) => {
			draggedEl = event.detail.draggedEl;
		}}
		on:dragEnd={() => (draggedEl = null)}
	>
		<h3>{title}</h3>
		{#if content}
			<div class="mt-2">{content}</div>
		{:else}
			<span>&nbsp;</span>
		{/if}
		<button
			aria-label="Delete card"
			class="absolute top-4 right-4 text-gray-400 hover:text-red-500"
			type="submit"
			on:click={(event) => {
				event.stopPropagation();

				$deleteItem.mutate(id);
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
	</div>
</div>
