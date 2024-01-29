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
	<div class="flex items-center gap-6">links</div>
	<div class="w-1/3 flex justify-end h-8">
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
