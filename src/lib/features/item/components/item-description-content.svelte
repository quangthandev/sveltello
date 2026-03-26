<script lang="ts">
	import markdownit from 'markdown-it';
	import Button from '$lib/components/ui/button/button.svelte';

	interface Props {
		content: string | null;
		onEdit: () => void;
	}

	let { content, onEdit }: Props = $props();

	const md = markdownit();
</script>

{#if content !== null && content.trim() !== ''}
	{@html md.render(content)}
{:else}
	<Button
		variant="secondary"
		class="w-full h-[60px] flex justify-start"
		aria-label="Edit description"
		onclick={(e: MouseEvent) => {
			e.preventDefault();
			onEdit();
		}}
	>
		Add a more detailed description...
	</Button>
{/if}
