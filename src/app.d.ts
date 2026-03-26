// See https://kit.svelte.dev/docs/types#app

import type { Session, UserDto } from '$lib/drizzle/schema';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserDto | null;
			session: Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
