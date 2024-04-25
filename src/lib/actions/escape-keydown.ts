// Reference: https://github.com/melt-ui/melt-ui/blob/develop/src/lib/internal/actions/escape-keydown/action.ts

import { get, readable, writable } from 'svelte/store';
import type { EscapeKeydownConfig } from './types';
import { isFunction, isHTMLElement, isReadable, noop } from '$lib/utils';

/**
 * Creates a readable store that tracks the latest Escape Keydown that occurred on the document.
 *
 * @returns A function to unsubscribe from the event listener and stop tracking keydown events.
 */
const documentEscapeKeyStore = readable<KeyboardEvent | undefined>(
	undefined,
	(set): (() => void) => {
		/**
		 * Event handler for keydown events on the document.
		 * Updates the store's value with the latest Escape Keydown event and then resets it to undefined.
		 */
		function keydown(event: KeyboardEvent | undefined) {
			if (event && event.key === 'Escape') {
				set(event);
			}

			// New subscriptions will not trigger immediately
			set(undefined);
		}

		// Adds a keydown event listener to the document, calling the keydown function when triggered.
		document.addEventListener('keydown', keydown);

		// Returns a function to unsubscribe from the event listener and stop tracking keydown events.
		return () => {
			document.removeEventListener('keydown', keydown);
		};
	}
);

// Store a collection of subscribed nodes
const nodes = writable<HTMLElement[]>([]);

export function escapeKeydown(node: HTMLElement, config: EscapeKeydownConfig = {}) {
	let unsub = noop;
	let enabled = isEnabled();

	// This is a hack to ensure only the latest subcribed node is enabled
	nodes.subscribe((value) => {
		enabled = value[value.length - 1] === node;
	});

	// Create a stack of nodes to handle nested click outside events
	nodes.update((prev) => {
		if (prev.includes(node)) {
			return prev;
		}

		return [...prev, node];
	});

	function isEnabled(): boolean {
		return isReadable(config.enabled) ? get(config.enabled) : !!config.enabled;
	}

	function update(config: EscapeKeydownConfig = {}) {
		unsub();

		const options = { enabled: true, ...config };

		unsub = documentEscapeKeyStore.subscribe((e) => {
			if (!e || !enabled) return;
			const target = e.target;

			if (!isHTMLElement(target)) {
				return;
			}

			e.preventDefault();

			// If an ignore function is passed, check if it returns true
			if (options.ignore) {
				if (isFunction(options.ignore)) {
					if (options.ignore(e)) return;
				}
				// If an ignore array is passed, check if any elements in the array match the target
				else if (Array.isArray(options.ignore)) {
					if (
						options.ignore.length > 0 &&
						options.ignore.some((ignoreEl) => {
							return ignoreEl && target === ignoreEl;
						})
					)
						return;
				}
			}

			// If none of the above conditions are met, call the handler
			options.handler?.(e);
		});
	}

	update(config);

	return {
		update,
		destroy() {
			unsub();
			nodes.update((prev) => prev.filter((n) => n !== node));
		}
	};
}
