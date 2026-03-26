import type { Session, UserDto } from '$lib/drizzle/schema';

export type SessionValidationResult =
	| { session: Session; user: UserDto; sessionExtended: boolean }
	| { session: null; user: null };
