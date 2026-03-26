import * as AuthRepository from './auth.repository';
import * as UserRepository from '$lib/features/user/user.repository';
import { generateSessionToken, encodeSessionToken } from '$lib/server/auth/session';
import {
	SESSION_EXPIRATION_TIME,
	SESSION_EXPIRATION_TIME_EXTENSION_THRESHOLD
} from './auth.constants';
import type { Session } from '$lib/drizzle/schema';
import type { SessionValidationResult } from './auth.types';
import { Argon2id } from '$lib/server/auth/password';
import { UserTransformer } from '../user/user.transformer';
import { EmailAlreadyExistsError, InvalidCredentialsError } from '$lib/errors';

export async function validateSession(
	token: string
): Promise<SessionValidationResult & { sessionExtended: boolean }> {
	const sessionId = encodeSessionToken(token);
	const session = await AuthRepository.getSessionById(sessionId);
	if (!session) {
		return { session: null, user: null, sessionExtended: false };
	}

	const user = await UserRepository.getUserById(session.userId);
	if (!user) {
		return { session: null, user: null, sessionExtended: false };
	}

	const now = Date.now();
	const expiresAt = new Date(session.expiresAt).getTime();

	// Session is expired
	if (now >= expiresAt) {
		await AuthRepository.deleteSession(session.id);
		return { session: null, user: null, sessionExtended: false };
	}

	let newSession: Session | null = session;
	const sessionExtended = expiresAt - now <= SESSION_EXPIRATION_TIME_EXTENSION_THRESHOLD;
	if (sessionExtended) {
		newSession = await AuthRepository.updateSessionExpiresAt(
			session.id,
			new Date(now + SESSION_EXPIRATION_TIME).toISOString()
		);
	}

	if (newSession == null) {
		return { session: null, user: null, sessionExtended: false };
	}

	return {
		session: newSession,
		user: UserTransformer.toDto(user),
		sessionExtended
	};
}

export async function invalidateSession(sessionId: string) {
	await AuthRepository.deleteSession(sessionId);
}

export async function login(email: string, password: string) {
	const existingUser = await UserRepository.getUserByEmail(email);
	if (!existingUser) {
		throw new InvalidCredentialsError();
	}

	const validPassword = await new Argon2id().verify(existingUser.password, password);
	if (!validPassword) {
		throw new InvalidCredentialsError();
	}

	return await createSession(existingUser.id);
}

export async function signup(email: string, password: string) {
	const existingUser = await UserRepository.getUserByEmail(email);
	if (existingUser) {
		throw new EmailAlreadyExistsError();
	}

	const user = await UserRepository.createUser(email, password);

	return await createSession(user.id);
}

async function createSession(userId: string): Promise<[Session, string]> {
	const token = generateSessionToken();
	const sessionId = encodeSessionToken(token);

	const session = await AuthRepository.createSession({
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + SESSION_EXPIRATION_TIME).toISOString()
	});

	return [session, token];
}
