<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children }: HTMLAttributes<HTMLDivElement> = $props();

	function mount(): Attachment {
		return (element) => {
			element.ownerDocument.body.appendChild(element);

			return () => {
				if (element.parentNode) {
					element.parentNode.removeChild(element);
				}
			};
		};
	}
</script>

<div class="contents" hidden {@attach mount()}>
	{@render children?.()}
</div>
