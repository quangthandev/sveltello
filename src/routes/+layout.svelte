<script>
	import { enhance } from '$app/forms';
	import { navigating } from '$app/stores';
	import NavigatingnIndicator from '$lib/components/NavigatingnIndicator.svelte';
	import '../app.css';

	export let data;
</script>

<header
	class="bg-slate-900 border-b border-slate-800 flex items-center justify-between py-4 px-8 box-border"
>
	<a href="/boards" class="font-black text-white text-2xl"> Home </a>
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
		{#if data.userId}
			<form method="post" action="/logout" use:enhance>
				<button class="block text-center">
					<span class="text-slate-500 text-xs uppercase font-bold flex flex-col items-center">
						<span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								width="24"
								height="24"
								fill="currentColor"
							>
								<title>logout</title>
								<path
									d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"
								/>
							</svg>
						</span>
						Log out
					</span>
				</button>
			</form>
		{:else}
			<a
				href="/login"
				class="text-slate-500 text-xs uppercase font-bold flex flex-col items-center"
			>
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="24"
						height="24"
						fill="currentColor"
					>
						<title>login</title>
						<path
							d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7M20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z"
						/>
					</svg>
				</span>
				Log in
			</a>
		{/if}
	</div>
</header>

<div class="flex-grow min-h-0 h-full">
	<slot />
</div>

{#if $navigating}
	<NavigatingnIndicator />
{/if}
