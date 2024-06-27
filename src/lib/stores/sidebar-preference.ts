import { persisted } from 'svelte-persisted-store';

export const sidebarPreference = persisted<{ expanded: boolean } | null>('sidebar-preference', {
	expanded: true
});
