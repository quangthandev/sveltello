import { db } from '$lib/drizzle/db';
import { session, user, type InsertSessionData } from '$lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';

export async function userExists(email: string) {
	const existingUser = await db
		.select({
			id: user.id
		})
		.from(user)
		.where(eq(user.email, email))
		.get();

	return !!existingUser;
}

export async function createUser(email: string, password: string) {
	const hashedPassword = await new Argon2id().hash(password);

	const newUser = await db
		.insert(user)
		.values({
			email,
			password: hashedPassword
		})
		.returning()
		.get();

	return newUser;
}

export async function getSessionById(sessionId: string) {
	return await db.query.session.findFirst({
		where: eq(session.id, sessionId)
	});
}

export async function createSession(data: InsertSessionData) {
	return await db.insert(session).values(data).returning().get();
}

export async function updateSessionExpiresAt(
	sessionId: string,
	expiresAt: InsertSessionData['expiresAt']
) {
	return await db
		.update(session)
		.set({ expiresAt })
		.where(eq(session.id, sessionId))
		.returning()
		.get();
}

export async function deleteSession(sessionId: string) {
	await db.delete(session).where(eq(session.id, sessionId));
}

export async function getUserById(userId: string) {
	return db.query.user.findFirst({
		where: eq(user.id, userId)
	});
}

export async function getUserByEmail(email: string) {
	const existingUser = db.query.user.findFirst({
		where: eq(user.email, email)
	});

	return existingUser;
}
