<script lang="ts">
	import { pushState } from '$app/navigation';
	import { page } from '$app/stores';
	import Modal from '$lib/components/ui/modal.svelte';
	import { cn } from '$lib/utils';
	import IconAttachment from '$lib/components/icons/icon-attachment.svelte';
	import type { ItemWithCoverAndAttachments } from '$lib/types';
	import ItemDetails from '$lib/features/items/components/item-details.svelte';

	export let item: ItemWithCoverAndAttachments;
	export let boardName: string;
	let className: string | undefined = undefined;
	export { className as class };

	$: ({ id, title, content, attachments, cover } = item);

	let pageState: App.PageState & { id?: string };
	$: pageState = $page.state;

	function handleNavigate(e: MouseEvent) {
		e.preventDefault();

		const { href } = e.currentTarget as HTMLAnchorElement;

		// Shallow routing
		pushState(href, { id });

		// Change page title
		document.title = `${title} on ${boardName} | Sveltello`;
	}
</script>

<a
	href="/items/{id}"
	class={cn(
		'relative border-t-2 border-b-2 -mb-[2px] last:mb-0 px-2 py-1 border-t-transparent border-b-transparent',
		'before:absolute before:inset-0 before:mx-[6px] before:my-[2px] before:rounded-lg',
		'hover:before:border-2 hover:before:border-cyan-500',
		className
	)}
	on:click={handleNavigate}
>
	{#if cover}
		<div class="h-48 bg-cover rounded-t-lg" style:background-image={`url(${cover.url})`}></div>
	{/if}
	<div
		class={cn(
			'bg-white shadow shadow-slate-300 border-4 border-transparent text-sm w-full py-1 px-2 relative space-y-2',
			cover ? 'rounded-b-lg' : 'rounded-lg'
		)}
	>
		<h3>{title}</h3>
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
		on:close={() => history.back()}
		containerClass={cn('items-start mt-16')}
		class={cn('w-11/12 md:w-9/12 lg:w-[768px] overflow-y-scroll no-scrollbar')}
	>
		<ItemDetails {id} on:close={() => history.back()} />
	</Modal>
{/if}
