<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import Portal from './Portal.svelte';
	import { browser } from '$app/environment';
	import { cn } from '$lib/utils';
	import { trapFocus } from '$lib/actions/trap-focus';
	import { clickOutside } from '$lib/actions/click-outside';
	import { escapeKeydown } from '$lib/actions/escape-keydown';

	let className: string | undefined = undefined;
	export { className as class };

	let backdropEl: HTMLDivElement;
	let modalEl: HTMLDivElement;

	const dispatch = createEventDispatcher<{ close: void }>();

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
	<div
		role="presentation"
		tabindex="-1"
		bind:this={backdropEl}
		transition:fade|global={{ easing: cubicOut, duration: 300 }}
		class="fixed inset-0 z-40 flex items-center justify-center bg-black/15 p-8"
	>
		<div
			role="dialog"
			tabindex="-1"
			bind:this={modalEl}
			use:trapFocus
			use:clickOutside={{
				handler: () => dispatch('close')
			}}
			use:escapeKeydown={{
				handler: () => dispatch('close')
			}}
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
