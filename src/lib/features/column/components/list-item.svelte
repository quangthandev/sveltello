<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import Modal from '$lib/components/ui/modal.svelte';
	import { cn } from '$lib/utils';
	import IconAttachment from '$lib/components/icons/icon-attachment.svelte';
	import type { ItemFullPayload, ItemWithCoverAndAttachments } from '$lib/types';
	import ItemDetails from '$lib/features/item/components/item-details.svelte';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { useItemQueryOptions } from '$lib/features/item/query-client/item.queries';
	import { tick } from 'svelte';
	import { transitionHelper } from '$lib/helpers';

	interface Props {
		item: ItemWithCoverAndAttachments;
		boardName: string;
		class?: string | undefined;
	}

	let { item, boardName, class: className = undefined }: Props = $props();

	let { id, title, content, attachments, cover } = $derived(item);

	let pageState: App.PageState & { id?: string } = $derived(page.state);

	let titleEl = $state<HTMLHeadingElement | null>(null);
	let coverEl = $state<HTMLDivElement | null>(null);
	let modal = $state<HTMLDialogElement | null>(null);

	const queryClient = useQueryClient();

	function handleMouseEnter() {
		const data = queryClient.getQueryData(useItemQueryOptions(id).queryKey);

		if (!data) {
			queryClient.prefetchQuery<ItemFullPayload>(useItemQueryOptions(id));
		}
	}

	async function handleNavigate(e: MouseEvent) {
		e.preventDefault();

		// Shallow routing
		const { href } = e.currentTarget as HTMLAnchorElement;
		pushState(href, { id });

		await tick();

		document.title = `${title} on ${boardName} | Sveltello`;

		transitionHelper({
			update() {
				if (!modal) return;

				modal.showModal();

				if (titleEl) {
					titleEl.style.viewTransitionName = '';
				}
				if (coverEl) {
					coverEl.style.viewTransitionName = '';
				}
			}
		});
	}

	function handleRequestModalClose() {
		transitionHelper({
			update() {
				if (!modal) return;

				modal.requestClose();

				const titleViewTransitionName = `item_${id}_title`;
				const coverViewTransitionName = `item_${id}_cover`;
				if (titleEl) {
					titleEl.style.viewTransitionName = titleViewTransitionName;
				}
				if (coverEl) {
					coverEl.style.viewTransitionName = coverViewTransitionName;
				}
			}
		});
	}

	function handleModalClose() {
		history.back();
		setTimeout(() => (document.title = `${boardName} | Sveltello`), 100);
	}
</script>

<!-- Since shallow routing is being used, we turn off data preload -->
<!-- and manually prefetch client-side on hover instead -->
<a
	data-sveltekit-preload-data="off"
	onmouseenter={handleMouseEnter}
	ontouchstart={handleMouseEnter}
	href="/items/{id}"
	class={cn(
		'relative border-t-2 border-b-2 -mb-[2px] last:mb-0 px-2 py-1 border-t-transparent border-b-transparent',
		'before:absolute before:inset-0 before:mx-[6px] before:my-[2px] before:rounded-lg',
		'hover:before:border-2 hover:before:border-cyan-500',
		className
	)}
	onclick={handleNavigate}
>
	{#if cover}
		<div
			bind:this={coverEl}
			class="h-48 bg-cover rounded-t-lg"
			style:background-image={`url(${cover.url})`}
			style:view-transition-name={pageState.id && pageState.id === id
				? `item_${id}_cover`
				: undefined}
		></div>
	{/if}
	<div
		class={cn(
			'bg-white shadow shadow-slate-300 border-4 border-transparent text-sm w-full py-1 px-2 relative space-y-2',
			cover ? 'rounded-b-lg' : 'rounded-lg'
		)}
	>
		<h3
			bind:this={titleEl}
			style:view-transition-name={pageState.id && pageState.id === id
				? `item_${id}_title`
				: undefined}
		>
			{title}
		</h3>
		{#if content || attachments?.length > 0}
			<div class="flex items-center gap-2">
				{#if content}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						fill="currentColor"
					>
						<title>description</title>
						<path
							d="M5,9.5L7.5,14H2.5L5,9.5M3,4H7V8H3V4M5,20A2,2 0 0,0 7,18A2,2 0 0,0 5,16A2,2 0 0,0 3,18A2,2 0 0,0 5,20M9,5V7H21V5H9M9,19H21V17H9V19M9,13H21V11H9V13Z"
						/>
					</svg>
				{/if}
				{#if attachments?.length > 0}
					<span class="flex gap-1" title="attachments">
						<IconAttachment />
						{attachments.length}
					</span>
				{/if}
			</div>
		{/if}
	</div>
</a>

{#if pageState.id && pageState.id === id}
	<Modal
		bind:node={modal}
		onDismiss={handleRequestModalClose}
		onClose={handleModalClose}
		class={cn('w-11/12 md:w-9/12 lg:w-[768px] overflow-y-scroll no-scrollbar rounded-2xl')}
	>
		<ItemDetails {id} onClose={handleRequestModalClose} />
	</Modal>
{/if}
