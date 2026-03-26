import { redirect } from '@sveltejs/kit';
import type { Session, User } from '$lib/drizzle/schema';

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
): asserts locals is { user: User; session: Session } {
	if (!locals.user) {
		if (returnUrl) {
			redirect(302, `/login?returnURL=${encodeURIComponent(returnUrl)}`);
		}

		redirect(302, '/login');
	}
}
