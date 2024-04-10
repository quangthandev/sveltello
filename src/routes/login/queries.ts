import { db } from '$lib/server/drizzle/db';
import { user } from '$lib/server/drizzle/schema';
import { eq } from 'drizzle-orm';
import { Argon2id } from 'oslo/password';

export async function login(email: string, password: string) {
	const existingUser = await db.query.user.findFirst({
		where: eq(user.email, email)
	});

	if (!existingUser) {
		return false;
	}

	const validPassword = await new Argon2id().verify(existingUser.password, password);

	if (!validPassword) {
		return false;
	}

	return existingUser.id;
}
