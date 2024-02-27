<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import Portal from './Portal.svelte';
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';

	let className: string | undefined = undefined;
	export { className as class };

	let backdropEl: HTMLDivElement;
	let modalEl: HTMLDivElement;

	const dispatch = createEventDispatcher<{ close: void }>();

	function handleKeydown(event: KeyboardEvent) {
		// close on ESC
		if (event.key === 'Escape') {
			event.preventDefault();
			dispatch('close');
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === backdropEl) {
			dispatch('close');
		}
	}

	onMount(() => {
		document.getElementById('app')?.setAttribute('inert', 'true');
		modalEl.focus();
	});

	onDestroy(() => {
		if (!browser) return;
		// remove inert attribute if this is the last modal
		if (document.querySelectorAll('[role="dialog"]:not(#app *)').length === 1) {
			document.getElementById('app')?.removeAttribute('inert');
		}
	});
</script>

<Portal>
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<div
		role="presentation"
		tabindex="-1"
		bind:this={backdropEl}
		on:click={handleBackdropClick}
		transition:fade|global={{ easing: cubicOut, duration: 300 }}
		class="fixed inset-0 z-40 flex items-center justify-center bg-black/15 p-8"
	>
		<div
			role="dialog"
			tabindex="-1"
			bind:this={modalEl}
			on:keydown={handleKeydown}
			class={cn(
				'max-h-[90dvh] overflow-y-auto overflow-x-hidden rounded-2xl bg-white shadow-2xl outline-none sm:-mt-10',
				className
			)}
			in:fly={{ y: 100, duration: 300, easing: cubicOut }}
		>
			<slot />
		</div>
	</div>
</Portal>
