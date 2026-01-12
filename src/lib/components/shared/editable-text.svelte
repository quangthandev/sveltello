<script lang="ts">
	import { enhance } from '$app/forms';
	import { tick, type Snippet } from 'svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';

	interface Props {
		value: string;
		fieldName: string;
		class?: string | undefined;
		inputClassName?: string | undefined;
		buttonClassName?: string | undefined;
		action: string;
		invalidateAll?: boolean | undefined;
		children?: Snippet;
		text?: Snippet;
		onSubmitting: (data: FormDataEntryValue | null) => void;
		onSubmitted: () => void;
	}

	let {
		value,
		fieldName,
		class: className = undefined,
		inputClassName = undefined,
		buttonClassName = undefined,
		action,
		invalidateAll = true,
		children,
		text,
		onSubmitting,
		onSubmitted
	}: Props = $props();

	let isEditing: boolean = $state(false);

	let button = $state<ReturnType<typeof Button> | null>(null);
	let input = $state<ReturnType<typeof Input> | null>(null);
</script>

<div class={className}>
	{#if isEditing}
		<form
			method="post"
			{action}
			use:enhance={({ formData }) => {
				isEditing = false;
				onSubmitting(formData.get(fieldName));

				return async ({ update }) => {
					await update({ invalidateAll });

					onSubmitted();
				};
			}}
		>
			{@render children?.()}
			<Input
				bind:this={input}
				{value}
				type="text"
				required
				name={fieldName}
				class={cn('px-2 py-1', inputClassName)}
				onblur={() => (isEditing = false)}
				onkeydown={async (event: KeyboardEvent) => {
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
			onclick={async () => {
				isEditing = true;
				await tick();
				input?.select();
			}}
		>
			{#if text}
				{@render text()}
			{:else}
				{value}
			{/if}
		</Button>
	{/if}
</div>
