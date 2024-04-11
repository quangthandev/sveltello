<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { page } from '$app/stores';
	import { generateId } from 'lucia';
	import { clickOutside } from '$lib/actions/click-outside';
	import { queriesCtx } from '../../../../routes/items/[id]/context';

	export let columnId: string;
	export let nextOrder: number;

	const dispatch = createEventDispatcher();

	let textareaEl: HTMLTextAreaElement;
	let buttonEl: HTMLButtonElement;

	onMount(() => {
		textareaEl.focus();
	});

	const { createItem } = queriesCtx.get();

	function handleSubmit(e: SubmitEvent) {
		const formData = new FormData(e.target as HTMLFormElement);
		const id = generateId(15);

		const data: Record<string, unknown> = {};
		data.id = id;
		data.boardId = parseInt($page.params.id);
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		// @ts-expect-error
		$createItem.mutate(data);

		textareaEl.value = '';

		dispatch('create');
	}
</script>

<form
	class="px-2 py-1 border-t-2 border-b-2 border-transparent"
	on:submit|preventDefault={handleSubmit}
	use:clickOutside={{ handler: () => dispatch('complete') }}
>
	<input type="hidden" name="columnId" value={columnId} />
	<input type="hidden" name="order" value={nextOrder} />

	<textarea
		required
		bind:this={textareaEl}
		name="title"
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
			class="rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
		>
			Save Card
		</button>
		<button
			type="button"
			on:click={() => dispatch('complete')}
			class="px-4 py-2 font-medium rounded-md hover:bg-gray-300"
		>
			Cancel
		</button>
	</div>
</form>
