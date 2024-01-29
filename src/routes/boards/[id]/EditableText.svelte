<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';

	export let value: string;
	export let fieldName: string;
	export let inputClassName: string;
	export let buttonClassName: string;

	let edit: boolean = false;

	let inputEl: HTMLInputElement;
	let buttonEl: HTMLButtonElement;
</script>

{#if edit}
	<form
		method="post"
		action="?/updateBoardName"
		use:enhance={() => {
			return async ({ update }) => {
				value = inputEl.value;
				await update();
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
			on:blur={() => (edit = false)}
			on:keydown={async (event) => {
				if (event.key === 'Escape') {
					edit = false;
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
			edit = true;
			await tick();
			inputEl?.select();
		}}
	>
		{value}
	</button>
{/if}
