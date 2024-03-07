<script lang="ts">
	import { popover } from '$lib/actions/popover';
	import Portal from '../Portal.svelte';
	import { popoverCtx } from './context';

	export let keydownHandler: ((e: KeyboardEvent) => void) | undefined = undefined;
	export let clickOutsideHandler: ((e: PointerEvent) => void) | undefined = undefined;

	const { triggerEl, open } = popoverCtx.get();

	const handleClickOutside = (e: CustomEvent<PointerEvent>) => {
		if ($triggerEl && $triggerEl.contains(e.detail.target as HTMLElement)) {
			return;
		}

		if (clickOutsideHandler) {
			return clickOutsideHandler(e.detail);
		}

		open.set(false);
	};

	const handleEscapeKeydown = (e: CustomEvent<KeyboardEvent>) => {
		if (keydownHandler) {
			return keydownHandler(e.detail);
		}

		open.set(false);
	};
</script>

{#if $open}
	<Portal>
		<div
			use:popover={{ open: $open, triggerEl: $triggerEl }}
			on:clickOutside={handleClickOutside}
			on:escapeKeydown={handleEscapeKeydown}
			{...$$restProps}
		>
			<slot />
		</div>
	</Portal>
{/if}
