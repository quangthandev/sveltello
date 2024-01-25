<script>
	import { enhance } from '$app/forms';
	import '../app.css';

	export let data;
</script>

<div
	class="bg-slate-900 border-b border-slate-800 flex items-center justify-between py-4 px-8 box-border"
>
	<a href="/boards" class="font-black text-white text-2xl"> Home </a>
	<div class="flex items-center gap-6">links</div>
	<div class="w-1/3 flex justify-end">
		{#if data.userId}
			<form method="post" action="/logout" use:enhance>
				<button class="block text-center">
					<span class="text-slate-500 text-xs uppercase font-bold"> Log out </span>
				</button>
			</form>
		{:else}
			<a href="/login" class="text-slate-500 text-xs uppercase font-bold"> Log in </a>
		{/if}
	</div>
</div>

<div class="flex-grow min-h-0 h-full">
	<slot />
</div>
