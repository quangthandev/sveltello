<script>
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
</script>

<form class="p-8 max-w-md" method="post" action="?/create" use:enhance>
	<div>
		<h2 class="text-xl font-bold mb-2">New Board</h2>
		<Input label="Name" name="name" type="text" required />
	</div>
	<div class="mt-4 flex items-center gap-4">
		<div class="flex items-center gap-1">
			<label for="board-color"> Color </label>
			<input id="board-color" name="color" type="color" value="#cbd5e1" class="bg-transparent" />
		</div>
		<Button type="submit">Create</Button>
	</div>
</form>
