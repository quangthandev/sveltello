import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import prisma from '$lib/server/prisma';
import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
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
