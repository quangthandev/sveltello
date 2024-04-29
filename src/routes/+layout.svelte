<script>
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import { navigating, page } from '$app/stores';
	import NavigatingnIndicator from '$lib/components/shared/navigating-indicator.svelte';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import IconLogin from '$lib/components/icons/icon-login.svelte';
	import IconLogout from '$lib/components/icons/icon-logout.svelte';
	import IconPlus from '$lib/components/icons/icon-plus.svelte';
	import NewBoard from '$lib/features/boards/components/new-board.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import '../app.css';

	export let data;

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
</script>

<svelte:head>
	<title>{$page.data.title ? `${$page.data.title} | Sveltello` : 'Sveltello'}</title>
	<meta name="description" content="A Trello clone built with SvelteKit" />
</svelte:head>

<QueryClientProvider client={queryClient}>
	<div class="flex flex-col h-full">
		<header
			class="bg-slate-900 border-b border-slate-800 flex items-center justify-between py-4 px-8 box-border h-appHeader z-20"
		>
			<div class="flex items-center gap-8">
				<a href={data.user ? '/boards' : '/'} class="font-black text-white text-2xl"> Sveltello </a>
				{#if data.user}
					<NewBoard let:trigger={triggerPopover}>
						<Button
							builders={[{ action: triggerPopover }]}
							class="flex gap-2 p-2"
							aria-label="create new board"
						>
							<IconPlus />
							<span class="hidden sm:inline">Create</span>
						</Button>
					</NewBoard>
				{/if}
			</div>
			<div class="w-1/3 flex items-center justify-end gap-4 h-8">
				<a href="https://github.com/quangthandev/sveltekit-kanban-board" target="_blank">
					<span class="text-white">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="40"
							height="40"
							fill="currentColor"
						>
							<title>github</title>
							<path
								d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
							/>
						</svg>
					</span>
				</a>
				{#if data.user}
					<form method="post" action="/logout" use:enhance>
						<Button
							type="submit"
							variant="ghost"
							class="text-slate-500 text-xs uppercase font-bold flex flex-col items-center py-0"
							aria-label="log out"
						>
							<IconLogout />
							<span class="hidden sm:inline">Log out</span>
						</Button>
					</form>
				{:else}
					<a
						href="/login"
						class="text-slate-500 text-xs uppercase font-bold flex flex-col items-center"
					>
						<IconLogin />
						<span class="hidden sm:inline">Log in</span>
					</a>
				{/if}
			</div>
		</header>

		<div class="flex-grow min-h-0 h-full">
			<SvelteQueryDevtools />
			<slot />
		</div>
	</div>
</QueryClientProvider>

{#if $navigating}
	<NavigatingnIndicator />
{/if}
