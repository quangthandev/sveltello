<script lang="ts">
	import { queriesCtx } from './context';

	export let title: string;
	export let content: string | null;
	export let id: string;

	const { deleteItem } = queriesCtx.get();
</script>

<div
	class="border-t-2 border-b-2 -mb-[2px] last:mb-0 px-2 py-1 border-t-transparent border-b-transparent"
>
	<div
		class="bg-white shadow shadow-slate-300 border-slate-300 text-sm rounded-lg w-full py-1 px-2 relative"
	>
		<h3>{title}</h3>
		{#if content}
			<div class="mt-2">{content}</div>
		{:else}
			<span>&nbsp;</span>
		{/if}
		<button
			aria-label="Delete card"
			class="absolute top-4 right-4 text-gray-400 hover:text-red-500"
			type="submit"
			on:click={(event) => {
				event.stopPropagation();

				$deleteItem.mutate(id);
			}}
		>
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					width="24"
					height="24"
					fill="currentColor"
				>
					<title>delete</title>
					<path
						d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
					/>
				</svg>
			</span>
		</button>
	</div>
</div>
