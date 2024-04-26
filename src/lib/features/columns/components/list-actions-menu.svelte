<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { tick } from 'svelte';
	import { cn } from '$lib/utils';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { TypedSubmitFunction } from '$lib/form';
	import * as Popover from '$lib/components/ui/popover';
	import IconMore from '$lib/components/icons/icon-more.svelte';
	import IconChevronLeft from '$lib/components/icons/icon-chevron-left.svelte';
	import IconClose from '$lib/components/icons/icon-close.svelte';
	import type { BoardWithColumns } from '$lib/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ActionData } from '../../../../routes/boards/[id]/$types';

	export let id: string;
	export let name: string;
	export let onAddCard: () => void;

	let isCopying = false;
	let columnToCopyName: HTMLTextAreaElement;
	let formElm: HTMLFormElement;

	const queryClient = useQueryClient();

	$: boardId = Number($page.params.id);

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
	<Popover.Trigger asChild let:triggerAction={triggerPopover}>
		<Button
			variant="ghost"
			size="icon"
			class="flex justify-center items-center text-muted-foreground"
			builders={[{ action: triggerPopover }]}
		>
			<IconMore />
		</Button>
	</Popover.Trigger>
	<Popover.Content
		class={cn('absolute top-0 left-0 bg-white shadow-lg py-4 rounded-lg w-72')}
		clickOutsideHandler={() => {
			if (isCopying) {
				isCopying = false;
			}

			close();
		}}
		escapeKeydownHandler={() => {
			if (isCopying) {
				isCopying = false;
			} else {
				close();
			}
		}}
	>
		<header class="relative mb-4">
			{#if isCopying}
				<Button
					variant="ghost"
					size="icon"
					on:click={() => (isCopying = false)}
					class="absolute -top-2 left-2 text-muted-foreground"
					aria-label="back"
				>
					<IconChevronLeft />
				</Button>
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
				bind:this={formElm}
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

								formElm.requestSubmit();
								isCopying = false;
							}
						}}
					/>
				</label>
				<Button type="submit" class="w-full">Create List</Button>
			</form>
		{:else}
			<ul>
				<li>
					<Button
						variant="ghost"
						on:click={() => {
							onAddCard();
							close();
						}}
						class="w-full flex justify-start rounded-none"
					>
						Add card
					</Button>
				</li>
				<li>
					<Button
						variant="ghost"
						class="w-full flex justify-start rounded-none"
						on:click={async () => {
							isCopying = true;
							await tick();
							columnToCopyName.select();
						}}
					>
						Copy list
					</Button>
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
						<Button type="submit" variant="ghost" class="w-full flex justify-start rounded-none"
							>Delete this list</Button
						>
					</form>
				</li>
			</ul>
		{/if}
	</Popover.Content>
</Popover.Root>
