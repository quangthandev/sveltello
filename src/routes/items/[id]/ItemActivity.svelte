<script lang="ts">
	import { page } from '$app/stores';
	import Avatar from '$lib/components/Avatar.svelte';
	import { formatTimestamp } from '$lib/utils';
	import type { Column, Item } from '@prisma/client';

	export let item: Item & { column: Column };
</script>

<div class="flex items-start gap-x-2 w-full">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class="h-5 w-5 mt-0.5 text-neutral-700"
	>
		<path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
	</svg>
	<div class="px-2 w-full">
		<h3 class="text-xl font-medium mb-4">Activity</h3>
		<ol class="mt-2 space-y-4">
			<li class="flex items-start gap-x-2">
				<Avatar userName={$page.data.user.email} />
				<div>
					<p class="hyphens-auto">
						<span class="font-bold">{$page.data.user.email}</span> added this card to
						<span class="font-medium">{item.column.name}</span>
					</p>
					<p class="text-sm text-muted-foreground">
						{formatTimestamp(item.createdAt)}
					</p>
				</div>
			</li>
		</ol>
	</div>
</div>
