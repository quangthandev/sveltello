<script lang="ts">
	import { onMount } from 'svelte';
	import { generateId } from 'lucia';
	import { clickOutside } from '$lib/actions/click-outside';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ZodError } from 'zod';
	import { useCreateItem } from '../query-client/mutations';
	import { createItemSchema } from '../schemas';

	interface Props {
		boardId: number;
		columnId: string;
		nextOrder: number;
		onCreate?: () => void;
		onComplete: () => void;
	}

	let { boardId, columnId, nextOrder, onCreate, onComplete }: Props = $props();

	let textareaEl = $state<HTMLTextAreaElement | null>(null);
	let formElm = $state<HTMLFormElement | null>(null);

	onMount(() => {
		textareaEl?.focus();
	});

	const createItemMutation = useCreateItem(boardId);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);
		const id = generateId(15);

		const data: Record<string, unknown> = {
			id,
			boardId
		};

		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		try {
			const parsedData = createItemSchema.parse(data);
			$createItemMutation.mutate(parsedData);
			if (textareaEl) {
				textareaEl.value = '';
			}
			onCreate?.();
		} catch (error) {
			console.error((error as ZodError).message);
		}
	}
</script>

<form
	bind:this={formElm}
	class="px-2 py-1 border-t-2 border-b-2 border-transparent"
	onsubmit={handleSubmit}
	use:clickOutside={{ handler: onComplete }}
>
	<input type="hidden" name="columnId" value={columnId} />
	<input type="hidden" name="order" value={nextOrder} />

	<textarea
		required
		bind:this={textareaEl}
		name="title"
		placeholder="Enter a title for this card"
		class="outline-none shadow text-sm rounded-lg w-full py-1 px-2 resize-none placeholder:text-sm placeholder:text-slate-500 h-14"
		onkeydown={(event) => {
			if (event.key === 'Enter') {
				event.preventDefault();

				formElm?.requestSubmit();
			} else if (event.key === 'Escape') {
				onComplete();
			}
		}}
		onchange={(event) => {
			let el = event.currentTarget;
			el.style.height = el.scrollHeight + 'px';
		}}
	></textarea>
	<div class="flex justify-between">
		<Button type="submit">Save Card</Button>
		<Button variant="ghost" onclick={onComplete}>Cancel</Button>
	</div>
</form>
