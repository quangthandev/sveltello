<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let content: string;
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild let:builder>
		<slot {builder} />
	</Tooltip.Trigger>
	<Tooltip.Content class="p-2 bg-slate-400">{content}</Tooltip.Content>
</Tooltip.Root>
