<script lang="ts">
	import { cn } from '$lib/utils';

	let className: string | undefined = '';
	export { className as class };
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 24 24"
	width="24"
	height="24"
	fill="currentColor"
	class={cn('animate-spin', className)}
>
	<title>loading</title>
	<path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
</svg>
