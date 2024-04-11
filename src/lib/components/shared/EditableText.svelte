<script lang="ts">
	import { enhance } from '$app/forms';
	import { createEventDispatcher, tick } from 'svelte';

	export let value: string;
	export let fieldName: string;
	export let inputClassName: string;
	export let buttonClassName: string;
	export let action: string;
	export let invalidateAll: boolean | undefined = true;

	let isEditing: boolean = false;

	let inputEl: HTMLInputElement;
	let buttonEl: HTMLButtonElement;

	const dispatch = createEventDispatcher<{ submitted: void }>();
</script>

{#if isEditing}
	<form
		method="post"
		{action}
		use:enhance={() => {
			value = inputEl.value;
			isEditing = false;

			return async ({ update }) => {
				await update({ invalidateAll });

				dispatch('submitted');
			};
		}}
	>
		<slot />
		<input
			bind:this={inputEl}
			type="text"
			required
			name={fieldName}
			{value}
			class={inputClassName}
			on:blur={() => (isEditing = false)}
			on:keydown={async (event) => {
				if (event.key === 'Escape') {
					isEditing = false;
					await tick();
					buttonEl?.focus();
				}
			}}
		/>
	</form>
{:else}
	<button
		bind:this={buttonEl}
		class={buttonClassName}
		on:click={async () => {
			isEditing = true;
			await tick();
			inputEl?.select();
		}}
	>
		{value}
	</button>
{/if}
