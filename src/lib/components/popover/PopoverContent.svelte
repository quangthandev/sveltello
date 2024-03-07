<script lang="ts">
	import { popover } from '$lib/actions/popover';
	import Portal from '../Portal.svelte';
	import { popoverCtx } from './context';

	const { triggerEl, open } = popoverCtx.get();

	const handleClickOutside = (e: CustomEvent<PointerEvent>) => {
		if ($triggerEl && $triggerEl.contains(e.detail.target as HTMLElement)) {
			return;
		}

		open.set(false);
	};
</script>

{#if $open}
	<Portal>
		<div
			use:popover={{ open: $open, triggerEl: $triggerEl }}
			on:clickOutside={handleClickOutside}
			{...$$restProps}
		>
			<slot />
		</div>
	</Portal>
{/if}

<svelte:document
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			open.set(false);
		}
	}}
/>
