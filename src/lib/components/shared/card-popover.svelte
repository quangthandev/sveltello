<script lang="ts">
	import PopoverNative from '../ui/popover-native.svelte';
	import { cn } from '$lib/utils';
	import IconClose from '$lib/components/icons/icon-close.svelte';

	export let targetId: string;
	let className: string | undefined = '';
	export { className as class };

	export let title: string;
</script>

<PopoverNative
	asChild
	{targetId}
	let:targetId
	class={cn('space-y-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm', className)}
>
	<slot {targetId} />
	<svelte:fragment slot="content" let:open>
		<div>
			<h3 class="font-bold text-center">{title}</h3>
			<button
				class="absolute top-2 right-4 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
				aria-label="close"
				popovertarget={targetId}
				popovertargetaction="hide"
			>
				<IconClose />
			</button>
		</div>
		<slot name="content" {open} />
	</svelte:fragment>
</PopoverNative>
