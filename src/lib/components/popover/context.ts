import { createContext } from '$lib/context';
import type { Writable } from 'svelte/store';

type PopoverContext = {
	triggerEl: Writable<HTMLElement | null>;
	open: Writable<boolean>;
};

export const popoverCtx = createContext<PopoverContext>();
