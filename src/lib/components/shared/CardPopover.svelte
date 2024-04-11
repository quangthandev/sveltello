<script lang="ts">
	import * as Popover from '$lib/components/popover';
	import { cn } from '$lib/utils';
	import IconClose from '$lib/components/icons/IconClose.svelte';

	export let title: string;
</script>

<Popover.Root>
	<Popover.Trigger asChild let:triggerAction={trigger}>
		<slot {trigger} />
	</Popover.Trigger>
	<Popover.Content
		class={cn(
			'absolute top-0 left-0 bg-white shadow-2xl py-4 rounded-lg w-80 z-50 border-2 border-gray-200'
		)}
	>
		<header>
			<header class="relative mb-4">
				<h3 class="font-bold text-center">{title}</h3>
				<Popover.Close
					class="absolute -top-2 right-2 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
					aria-label="close"
				>
					<IconClose />
				</Popover.Close>
			</header>
		</header>
		<slot name="content" />
	</Popover.Content>
</Popover.Root>
