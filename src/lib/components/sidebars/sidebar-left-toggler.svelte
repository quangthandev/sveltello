<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let tooltip: string;
</script>

<Tooltip.Root>
	<Tooltip.Trigger asChild let:builder>
		<slot {builder} />
	</Tooltip.Trigger>
	<Tooltip.Content class="p-2 flex gap-2 justify-center items-center bg-slate-400">
		{tooltip}
		<code class="w-6 h-6">[</code>
	</Tooltip.Content>
</Tooltip.Root>
