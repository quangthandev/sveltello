<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import { cn } from '$lib/utils';
	import IconClose from '$lib/components/icons/icon-close.svelte';
	import * as Card from '$lib/components/ui/card/index';

	let className: string | undefined = '';
	export { className as class };

	export let title: string;
</script>

<Popover.Root let:open let:close>
	<Popover.Trigger asChild let:triggerAction={trigger} on:open on:close>
		<slot {trigger} />
	</Popover.Trigger>
	<Popover.Content class={cn('absolute top-0 left-0 z-50', className)}>
		<Card.Root>
			<Card.Header>
				<Card.Title class="font-bold text-center">{title}</Card.Title>
				<Popover.Close
					class="absolute top-2 right-4 text-muted-foreground p-2 rounded-md hover:bg-gray-300"
					aria-label="close"
				>
					<IconClose />
				</Popover.Close>
			</Card.Header>
			<Card.Content class="p-4">
				<slot name="content" {open} {close} />
			</Card.Content>
		</Card.Root>
	</Popover.Content>
</Popover.Root>
