<script>
	import { onMount } from 'svelte';

	let p = 0;
	let visible = false;

	onMount(() => {
		function next() {
			visible = true;
			p += 0.1;

			const remaining = 1 - p;
			if (remaining > 0.15) setTimeout(next, 500 / remaining);
		}

		setTimeout(next, 250);
	});
</script>

{#if visible}
	<div class="absolute top-16 left-0 w-full h-1 z-50">
		<div
			class="absolute left-0 top-0 h-full bg-cyan-500 transition-width"
			style="width: {p * 100}%"
		/>
	</div>
{/if}

{#if p >= 0.4}
	<div class="fixed w-full h-full bg-black opacity-30 pointer-events-none z-40 animate-fade" />
{/if}
