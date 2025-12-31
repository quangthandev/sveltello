<script lang="ts">
	import { onMount } from 'svelte';

	export let asChild = false;
	export let targetId = Math.random().toString(36).substring(2);
	export let action: 'toggle' | 'show' | 'hide' = 'toggle';

	let className: string | undefined = '';
	export { className as class };

	let open = false;

	onMount(() => {
		const targetElement = document.getElementById(targetId);

		if (!targetElement) return;

		function handleToggle(event: ToggleEvent) {
			open = event.newState === 'open';
		}

		targetElement.addEventListener('toggle', handleToggle);

		return () => targetElement.removeEventListener('toggle', handleToggle);
	});
</script>

{#if asChild}
	<slot {targetId} {action} />
{:else}
	<button type="button" {...$$restProps} popovertarget={targetId} popovertargetaction={action}>
		<slot {targetId} {action} />
	</button>
{/if}

<div id={targetId} popover="auto" class={className}>
	<slot name="content" {open} />
</div>
