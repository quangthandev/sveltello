<script lang="ts">
	import { enhance } from '$app/forms';
	import { createEventDispatcher, tick } from 'svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import type { TypedSubmitFunction } from '$lib/form';
	import CardPopover from '$lib/components/shared/card-popover.svelte';
	import IconMore from '$lib/components/icons/icon-more.svelte';
	import IconChevronLeft from '$lib/components/icons/icon-chevron-left.svelte';
	import type { BoardWithColumns } from '$lib/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ActionData } from '../../../../routes/(user)/boards/[id=integer]/$types';
	import { cn } from '$lib/utils';

	export let id: string;
	export let name: string;
	export let boardId: number;

	let isCopying = false;
	let columnToCopyName: HTMLTextAreaElement;
	let formElm: HTMLFormElement;

	const popoverTargetId = `list_actions_menu_${id}`;

	const queryClient = useQueryClient();

	const dispatch = createEventDispatcher<{ addCard: void }>();

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

<CardPopover
	title={isCopying ? 'Copy List' : 'List actions'}
	targetId={popoverTargetId}
	let:targetId
	on:toggle={(event) => {
		const open = event.detail;

		// Reset copying state on close
		if (!open) {
			isCopying = false;
		}
	}}
	class={cn('relative', {
		'px-0': !isCopying
	})}
>
	<Button
		variant="ghost"
		size="icon"
		class="flex justify-center items-center text-muted-foreground"
		aria-label="open list actions"
		popovertarget={targetId}
	>
		<IconMore />
	</Button>
	<svelte:fragment slot="content">
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
			<form
				bind:this={formElm}
				method="post"
				action="?/copyColumn"
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
			<ul class="min-w-72">
				<li>
					<Button
						variant="ghost"
						on:click={() => {
							dispatch('addCard');
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
	</svelte:fragment>
</CardPopover>
