<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import markdownit from 'markdown-it';

	export let content: string | null;

	const dispatch = createEventDispatcher();

	const md = markdownit();
</script>

{#if content !== null && content.trim() !== ''}
	{@html md.render(content)}
{:else}
	<button
		class="absolute inset-0 text-left px-4 bg-gray-200 hover:bg-gray-300"
		aria-label="Edit description"
		on:click|preventDefault={() => dispatch('edit')}
	>
		{'Add a more detailed description...'}
	</button>
{/if}
