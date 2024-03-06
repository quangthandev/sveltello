export function trapFocus(node: HTMLElement) {
	const previous = document.activeElement;

	function focusable() {
		return Array.from(
			node.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;

		const current = document.activeElement;

		const elements = focusable();
		const first = elements.at(0);
		const last = elements.at(-1);

		if (event.shiftKey && current === first) {
			if (last instanceof HTMLElement) {
				last.focus();
			}
			event.preventDefault();
		}

		if (!event.shiftKey && current === last) {
			if (first instanceof HTMLElement) {
				first.focus();
			}
			event.preventDefault();
		}
	}

	const firstElement = focusable()[0];

	if (firstElement instanceof HTMLElement) {
		firstElement.focus();
	}

	node.addEventListener('keydown', handleKeydown);

	return {
		destroy() {
			node.removeEventListener('keydown', handleKeydown);
			if (previous instanceof HTMLElement) {
				previous.focus();
			}
		}
	};
}
