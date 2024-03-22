<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="w-full flex justify-center items-center gap-8 wrapper">
	<h1 class="font-bold text-xl pr-8 border-r-2 border-neutral-500">{$page.status}</h1>
	<p>{$page.error?.message || 'Not found'}</p>
</div>

<style>
	.wrapper {
		height: calc(100vh - var(--app-header-height));
		margin-top: calc(var(--app-header-height) * -1);
		transform: translateY(var(--app-header-height));
	}
</style>
