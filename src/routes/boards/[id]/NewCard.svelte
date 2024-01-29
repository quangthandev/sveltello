<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ItemMutationFields } from './types';
	import { enhance } from '$app/forms';
	import { clickOutside } from './actions';

	export let columnId: string;
	export let nextOrder: number;

	const dispatch = createEventDispatcher();

	let textareaEl: HTMLTextAreaElement;
	let formEl: HTMLFormElement;
	let buttonEl: HTMLButtonElement;

	let id = crypto.randomUUID();
</script>

<form
	method="post"
	action="?/createCard"
	class="px-2 py-1 border-t-2 border-b-2 border-transparent"
	bind:this={formEl}
	use:enhance={() => {
		dispatch('creating', {
			id,
			title: textareaEl.value,
			content: null,
			order: nextOrder,
			columnId
		});

		textareaEl.value = '';

		return async ({ update }) => {
			await update();
			dispatch('created', { id });
		};
	}}
	use:clickOutside
	on:clickOutside={() => {
		dispatch('complete');
	}}
>
	<input type="hidden" name={ItemMutationFields.columnId.name} value={columnId} />
	<input type="hidden" name={ItemMutationFields.order.name} value={nextOrder} />
	<input type="hidden" name="id" value={id} />

	<!-- svelte-ignore a11y-autofocus -->
	<textarea
		autofocus
		required
		bind:this={textareaEl}
		name={ItemMutationFields.title.name}
		placeholder="Enter a title for this card"
		class="outline-none shadow text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14"
		on:keydown={(event) => {
			if (event.key === 'Enter') {
				event.preventDefault();

				buttonEl.click();
			}
			if (event.key === 'Escape') {
				dispatch('complete');
			}
		}}
		on:change={(event) => {
			let el = event.currentTarget;
			el.style.height = el.scrollHeight + 'px';
		}}
	/>
	<div class="flex justify-between">
		<button
			bind:this={buttonEl}
			class="rounded-md bg-blue-400 px-1 py-1 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
		>
			Save Card
		</button>
		<button type="button" on:click={() => dispatch('complete')}>Cancel</button>
	</div>
</form>
