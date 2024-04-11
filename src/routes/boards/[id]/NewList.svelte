<script lang="ts">
	import { tick } from 'svelte';
	import { clickOutside } from '$lib/actions/click-outside';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import type { WithOptional } from '$lib/utils';
	import type { Board, Column, ColumnMutation } from '../../types';
	import { generateId } from 'lucia';

	export let boardId: number;

	let inputEl: HTMLInputElement;
	let editing: boolean;

	const queryClient = useQueryClient();

	const createColumnMutation = createMutation<unknown, unknown, ColumnMutation>({
		mutationFn: async (data) => {
			await fetch('/api/columns', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
		},
		onMutate: async (data) => {
			const prevBoardData = queryClient.getQueryData<
				Board & { columns: WithOptional<Column, 'order'>[] }
			>(['boards', boardId.toString()]);

			if (prevBoardData) {
				queryClient.setQueryData(['boards', boardId.toString()], {
					...prevBoardData,
					columns: [
						...prevBoardData.columns,
						{
							id: data.id,
							name: data.name,
							boardId,
							items: []
						}
					]
				});
			}

			return { prevBoardData };
		},
		onError: (_err: any, _variables: any, context: any) => {
			if (context?.prevBoardData) {
				queryClient.setQueryData(['boards', boardId.toString()], context.prevBoardData);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['boards', boardId.toString()]
			});
		}
	});

	const handleSubmit = (e: SubmitEvent) => {
		const formData = new FormData(e.target as HTMLFormElement);
		const id = generateId(15);

		const data: ColumnMutation = {
			id,
			boardId,
			name: formData.get('name') as string
		};

		$createColumnMutation.mutate(data);

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
			<button
				class="rounded-md bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
			>
				Add Column
			</button>
			<button
				on:click={() => (editing = false)}
				class="px-4 py-2 font-medium rounded-md hover:bg-gray-300"
			>
				Cancel
			</button>
		</div>
	</form>
{:else}
	<button
		aria-label="Add new column"
		class="flex-shrink-0 flex justify-center gap-2 px-6 py-4 text-white bg-black bg-opacity-60 hover:bg-opacity-80 rounded-xl"
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
		</span> Add new column
	</button>
{/if}
