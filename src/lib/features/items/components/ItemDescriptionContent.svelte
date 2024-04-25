<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import markdownit from 'markdown-it';
	import Button from '$lib/components/ui/button/button.svelte';

	export let content: string | null;

	const dispatch = createEventDispatcher();

	const md = markdownit();
</script>

{#if content !== null && content.trim() !== ''}
	{@html md.render(content)}
{:else}
	<Button
		variant="secondary"
		class="w-full h-[60px] flex justify-start"
		aria-label="Edit description"
		on:click={(e) => {
			e.preventDefault();
			dispatch('edit');
		}}
	>
		{'Add a more detailed description...'}
	</Button>
{/if}
