import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

import { dbClient } from '$lib/drizzle/db';
import {
	adapterOptions,
	generateSessionAttributes,
	generateUserAttributes,
	type DatabaseSessionAttributes,
	type DatabaseUserAttributes
} from './utils';
import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';

const adapter = new LibSQLAdapter(dbClient, adapterOptions);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return generateUserAttributes(attributes);
	},
	getSessionAttributes: (attributes) => {
		return generateSessionAttributes(attributes);
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
	}
}

/**
 * Checks if the user is authenticated.
 * Throws a redirect error if the user is not authenticated.
 *
 * @param locals - The locals object containing the user and session.
 * @param returnUrl - The URL to redirect to after authentication.
 * @throws {RedirectError} - Throws a redirect error if the user is not authenticated.
 */
export function checkAuthUser(
	locals: App.Locals,
	returnUrl?: string
): asserts locals is { user: import('lucia').User; session: import('lucia').Session } {
	if (!locals.user) {
		if (returnUrl) {
			throw redirect(302, `/login?returnURL=${encodeURIComponent(returnUrl)}`);
		}

		throw redirect(302, '/login');
	}
}
