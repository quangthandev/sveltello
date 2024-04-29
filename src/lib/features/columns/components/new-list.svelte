<script lang="ts">
	import { tick } from 'svelte';
	import { clickOutside } from '$lib/actions/click-outside';
	import type { ColumnMutation } from '$lib/types';
	import { generateId } from 'lucia';
	import { useCreateColumn } from '../query-client/mutations';
	import { insertColumnSchema } from '../schemas';
	import Button from '$lib/components/ui/button/button.svelte';

	export let boardId: number;

	let inputEl: HTMLInputElement;
	let editing: boolean;

	$: createColumnMutation = useCreateColumn(boardId);

	const handleSubmit = (e: SubmitEvent) => {
		const formData = new FormData(e.target as HTMLFormElement);
		const id = generateId(15);

		const data: ColumnMutation = {
			id,
			boardId,
			name: formData.get('name') as string
		};

		const result = insertColumnSchema.safeParse(data);

		if (!result.success) {
			// TODO: Handle error e.g. display error message with toast
			console.error(result.error);
			return;
		}

		$createColumnMutation.mutate(result.data);

		inputEl.value = '';
	};
</script>

{#if editing}
	<form
		class="p-2 flex-shrink-0 flex flex-col gap-5 overflow-hidden max-h-full w-80 border rounded-xl shadow bg-slate-100"
		on:submit|preventDefault={handleSubmit}
		use:clickOutside={{ handler: () => (editing = false) }}
	>
		<input type="hidden" name="boardId" value={boardId} />
		<input
			required
			bind:this={inputEl}
			type="text"
			name="name"
			placeholder="Enter column name..."
			class="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
			on:keydown={(event) => {
				if (event.key === 'Escape') {
					editing = false;
				}
			}}
		/>
		<div class="flex justify-between">
			<Button type="submit">Add Column</Button>
			<Button variant="ghost" on:click={() => (editing = false)}>Cancel</Button>
		</div>
	</form>
{:else}
	<Button
		size="lg"
		aria-label="Add new column"
		class="w-80 flex-shrink-0 justify-start gap-2 bg-black bg-opacity-60 hover:bg-black hover:bg-opacity-80 rounded-xl"
		on:click={async () => {
			editing = true;
			await tick();
			inputEl.focus();
		}}
	>
		<span>
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
		</span> Add new list
	</Button>
{/if}
