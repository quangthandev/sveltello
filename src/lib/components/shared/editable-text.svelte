<script lang="ts">
	import { enhance } from '$app/forms';
	import { createEventDispatcher, tick } from 'svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';

	export let value: string;
	export let fieldName: string;
	let className: string | undefined = undefined;
	export { className as class };
	export let inputClassName: string | undefined = undefined;
	export let buttonClassName: string | undefined = undefined;
	export let action: string;
	export let invalidateAll: boolean | undefined = true;

	let isEditing: boolean = false;

	let button: Button;
	let input: Input;

	const dispatch = createEventDispatcher<{
		submitting: FormDataEntryValue | null;
		submitted: void;
	}>();
</script>

<div class={className}>
	{#if isEditing}
		<form
			method="post"
			{action}
			use:enhance={({ formData }) => {
				isEditing = false;
				dispatch('submitting', formData.get(fieldName));

				return async ({ update }) => {
					await update({ invalidateAll });

					dispatch('submitted');
				};
			}}
		>
			<slot />
			<Input
				bind:this={input}
				{value}
				type="text"
				required
				name={fieldName}
				class={cn('px-2 py-1', inputClassName)}
				on:blur={() => (isEditing = false)}
				on:keydown={async (event) => {
					if (event.key === 'Escape') {
						isEditing = false;
						await tick();
						button?.focus();
					}
				}}
			/>
		</form>
	{:else}
		<Button
			bind:this={button}
			variant="ghost"
			class={cn('px-2 py-1', buttonClassName)}
			on:click={async () => {
				isEditing = true;
				await tick();
				input.select();
			}}
		>
			{value}
		</Button>
	{/if}
</div>
