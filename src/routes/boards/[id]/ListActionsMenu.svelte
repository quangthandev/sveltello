<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import Portal from '$lib/components/Portal.svelte';
	import { popover } from '$lib/actions/popover';
	import { cn } from '$lib/utils';
	import { clickOutside } from '$lib/actions/click-outside';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { Board, Column } from '@prisma/client';
	import type { TypedSubmitFunction } from '$lib/form';
	import type { ActionData } from './$types';

	export let id: string;
	export let name: string;
	export let onAddCard: () => void;

	let content: HTMLDivElement;
	let open = false;
	let isCopying = false;
	let columnToCopyName: HTMLTextAreaElement;
	let submitBtn: HTMLButtonElement;

	const queryClient = useQueryClient();

	$: boardId = $page.params.id;

	const handleCopyList: TypedSubmitFunction<ActionData> = () => {
		open = false;

		return async ({ update }) => {
			await update({ invalidateAll: false });

			queryClient.invalidateQueries({
				queryKey: ['boards', boardId]
			});
		};
	};

	const handleDelete: TypedSubmitFunction<ActionData> = () => {
		queryClient.setQueryData<Board & { columns: Column[] }>(['boards', boardId], (prevData) => {
			if (!prevData) return;
			return {
				...prevData,
				columns: prevData.columns.filter((column) => column.id !== id)
			};
		});

		open = false;

		return ({ update }) => {
			update({ invalidateAll: false });

			queryClient.invalidateQueries({
				queryKey: ['boards', boardId]
			});
		};
	};
</script>

<button
	class="text-muted-foreground p-2 rounded-md hover:bg-gray-300"
	use:popover={{ content }}
	on:trigger={() => (open = !open)}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		fill="currentColor"
	>
		<path
			d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z"
		/>
	</svg>
</button>
<Portal>
	<div
		bind:this={content}
		use:clickOutside
		on:clickOutside={() => {
			open = false;
			isCopying = false;
		}}
		class={cn('absolute top-0 left-0 bg-white shadow-lg py-4 rounded-lg w-72', {
			hidden: !open
		})}
	>
		<header class="relative mb-4">
			{#if isCopying}
				<button
					on:click={() => (isCopying = false)}
					class="absolute -top-2 left-2 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						fill="currentColor"
					>
						<title>back</title>
						<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
					</svg>
				</button>
			{/if}
			<h6 class="font-bold text-center">
				{isCopying ? 'Copy list' : 'List actions'}
			</h6>
			<button
				on:click={() => (open = false)}
				class="absolute -top-2 right-2 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					fill="currentColor"
				>
					<title>close</title>
					<path
						d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
					/>
				</svg>
			</button>
		</header>
		{#if isCopying}
			<form method="post" action="?/copyColumn" class="px-4" use:enhance={handleCopyList}>
				<input hidden name="id" value={id} />
				<label>
					Name:
					<!-- svelte-ignore a11y-autofocus -->
					<textarea
						bind:this={columnToCopyName}
						autofocus
						name="name"
						required
						class="border w-full rounded-lg py-1 px-2 mb-6 font-medium text-black"
						value={name}
						on:keypress={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();

								submitBtn.click();
								isCopying = false;
							}
						}}
					/>
				</label>
				<button
					bind:this={submitBtn}
					type="submit"
					class="bg-blue-600 text-white rounded-lg py-2 px-4 font-medium"
				>
					Create List
				</button>
			</form>
		{:else}
			<ul>
				<li>
					<button
						on:click={() => {
							onAddCard();
							open = false;
						}}
						class="w-full text-left px-4 py-2 -mr-4 hover:bg-gray-200"
					>
						Add card
					</button>
				</li>
				<li>
					<button
						class="w-full text-left px-4 py-2 -mr-4 hover:bg-gray-200"
						on:click={async () => {
							isCopying = true;
							await tick();
							columnToCopyName.select();
						}}
					>
						Copy list
					</button>
				</li>
				<hr />
				<li>
					<form method="post" action="?/deleteColumn" use:enhance={handleDelete}>
						<input hidden name="id" id="id" value={id} />
						<button class="w-full text-left px-4 py-2 -mr-4 hover:bg-gray-200">
							Delete this list
						</button>
					</form>
				</li>
			</ul>
		{/if}
	</div>
</Portal>
