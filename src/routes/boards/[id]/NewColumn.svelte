<script lang="ts">
	import { tick } from 'svelte';
	import { clickOutside } from './actions';

	export let boardId: number;

	let inputEl: HTMLInputElement;

	let editing: boolean;
</script>

{#if editing}
	<form
		method="post"
		action="?/createColumn"
		class="p-2 flex-shrink-0 flex flex-col gap-5 overflow-hidden max-h-full w-80 border rounded-xl shadow bg-slate-100"
		use:clickOutside
		on:clickOutside={() => {
			editing = false;
		}}
	>
		<input type="hidden" name="boardId" value={boardId} />
		<input
			required
			bind:this={inputEl}
			type="text"
			name="name"
			placeholder="Enter column name..."
			class="border border-slate-400 w-full rounded-lg py-1 px-2 font-medium text-black"
			on:keydown={(event) => {
				if (event.key === 'Escape') {
					editing = false;
				}
			}}
		/>
		<div class="flex justify-between">
			<button
				class="rounded-md bg-blue-400 px-1 py-1 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
			>
				Add Column
			</button>
			<button on:click={() => (editing = false)}>Cancel</button>
		</div>
	</form>
{:else}
	<button
		aria-label="Add new column"
		class="flex-shrink-0 flex justify-center gap-2 px-6 py-4 text-white bg-black bg-opacity-50 hover:bg-opacity-20 rounded-xl"
		on:click={async () => {
			editing = true;
			await tick();
			inputEl?.focus();
		}}
	>
		<span>
			<svg
				width="24"
				height="24"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<title>add</title>
				<path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
			</svg>
		</span> Add new column
	</button>
{/if}
