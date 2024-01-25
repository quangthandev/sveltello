<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export let label: string;
	export let id: string | null | undefined = undefined;

	id = id ?? crypto.randomUUID();

	type $$Props = HTMLInputAttributes & {
		label: string;
	};

	export let value: $$Props['value'] = undefined;
</script>

<label for={id} class="block text-sm font-medium leading-6 text-gray-900">{label}</label>
<input
	class="form-input block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-400 sm:text-sm sm:leading-6"
	{id}
	bind:value
	{...$$restProps}
/>
