<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { cn } from '$lib/utils';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { TypedSubmitFunction } from '$lib/form';
	import * as Popover from '$lib/components/popover';
	import IconMore from '$lib/components/icons/IconMore.svelte';
	import IconChevronLeft from '$lib/components/icons/IconChevronLeft.svelte';
	import IconClose from '$lib/components/icons/IconClose.svelte';
	import type { BoardWithColumns } from '$lib/types';
	import type { ActionData } from '../../../../routes/boards/[id]/$types';

	export let id: string;
	export let name: string;
	export let onAddCard: () => void;

	let isCopying = false;
	let columnToCopyName: HTMLTextAreaElement;
	let submitBtn: HTMLButtonElement;

	const queryClient = useQueryClient();

	$: boardId = $page.params.id;

	const handleCopyList: TypedSubmitFunction<ActionData> = () => {
		return async ({ update }) => {
			await update({ invalidateAll: false });

			queryClient.invalidateQueries({
				queryKey: ['boards', boardId]
			});
		};
	};

	const handleDelete: TypedSubmitFunction<ActionData> = () => {
		queryClient.setQueryData<BoardWithColumns>(['boards', boardId], (prevData) => {
			if (!prevData) return;
			return {
				...prevData,
				columns: prevData.columns.filter((column) => column.id !== id)
			};
		});

		return ({ update }) => {
			update({ invalidateAll: false });

			queryClient.invalidateQueries({
				queryKey: ['boards', boardId]
			});
		};
	};
</script>

<Popover.Root let:close>
	<Popover.Trigger class="text-muted-foreground p-2 rounded-md hover:bg-gray-300" aria-label="more">
		<IconMore />
	</Popover.Trigger>
	<Popover.Content
		class={cn('absolute top-0 left-0 bg-white shadow-lg py-4 rounded-lg w-72')}
		clickOutsideHandler={() => {
			if (isCopying) {
				isCopying = false;
			}

			close();
		}}
		keydownHandler={() => {
			if (isCopying) {
				isCopying = false;
			} else {
				close();
			}
		}}
	>
		<header class="relative mb-4">
			{#if isCopying}
				<button
					on:click={() => (isCopying = false)}
					class="absolute -top-2 left-2 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
					aria-label="back"
				>
					<IconChevronLeft />
				</button>
			{/if}
			<h6 class="font-bold text-center">
				{isCopying ? 'Copy list' : 'List actions'}
			</h6>
			<Popover.Close
				class="absolute -top-2 right-2 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
				aria-label="close"
			>
				<IconClose />
			</Popover.Close>
		</header>
		{#if isCopying}
			<form
				method="post"
				action="?/copyColumn"
				class="px-4"
				use:enhance={(data) => {
					close();

					return handleCopyList(data);
				}}
			>
				<input hidden name="id" value={id} />
				<label>
					Name:
					<textarea
						bind:this={columnToCopyName}
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
							close();
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
					<form
						method="post"
						action="?/deleteColumn"
						use:enhance={(data) => {
							close();

							return handleDelete(data);
						}}
					>
						<input hidden name="id" id="id" value={id} />
						<button class="w-full text-left px-4 py-2 -mr-4 hover:bg-gray-200">
							Delete this list
						</button>
					</form>
				</li>
			</ul>
		{/if}
	</Popover.Content>
</Popover.Root>
