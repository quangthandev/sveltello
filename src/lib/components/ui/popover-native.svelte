<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let asChild = false;
	export let targetId = Math.random().toString(36).substring(2);
	export let action: 'toggle' | 'show' | 'hide' = 'toggle';

	let className: string | undefined = '';
	export { className as class };

	let open = false;

	const dispatch = createEventDispatcher<{
		toggle: boolean;
	}>();

	onMount(() => {
		const targetElement = document.getElementById(targetId);

		if (!targetElement) return;

		function handleToggle(event: ToggleEvent) {
			open = event.newState === 'open';
			dispatch('toggle', open);
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
