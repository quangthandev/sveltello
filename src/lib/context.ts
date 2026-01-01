// Reference: https://gist.github.com/tlux/0d87ec94581866567dad2ce64fa7c527

import { getContext, setContext } from 'svelte';

/**
 * The context object.
 */
export interface Context<T> {
	get: () => T;
	set: (ctx: T) => T;
}

function randomContextName() {
	const randomName = Math.random().toString(36).substring(2);
	return `$$context_${randomName}`;
}

/**
 * Creates a context.
 */
export function createContext<T>(key: unknown = randomContextName()): Context<T> {
	return {
		get: () => getContext<T>(key),
		set: (ctx: T) => setContext(key, ctx)
	};
}
