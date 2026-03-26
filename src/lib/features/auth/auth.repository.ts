import { db } from '$lib/drizzle/db';
import { session, type InsertSessionData } from '$lib/drizzle/schema';
import { eq } from 'drizzle-orm';

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
