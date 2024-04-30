import { persisted } from 'svelte-persisted-store';

export const sidebarPreference = persisted('sidebar-preference', {
	expanded: false
});
