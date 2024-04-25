<script lang="ts">
	import { enhance } from '$app/forms';
	import { createEventDispatcher, tick } from 'svelte';
	import Input from '$lib/components/ui/input/input.svelte';

	export let value: string;
	export let fieldName: string;
	export let inputClassName: string;
	export let buttonClassName: string;
	export let action: string;
	export let invalidateAll: boolean | undefined = true;

	let isEditing: boolean = false;

	let buttonEl: HTMLButtonElement;
	let input: Input;

	const dispatch = createEventDispatcher<{ submitted: void }>();
</script>

{#if isEditing}
	<form
		method="post"
		{action}
		use:enhance={() => {
			isEditing = false;

			return async ({ update }) => {
				await update({ invalidateAll });

				dispatch('submitted');
			};
		}}
	>
		<slot />
		<Input
			bind:this={input}
			bind:value
			type="text"
			required
			name={fieldName}
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
			input.select();
		}}
	>
		{value}
	</button>
{/if}
