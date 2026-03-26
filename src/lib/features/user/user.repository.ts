import { db } from '$lib/drizzle/db';
import { user } from '$lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import { Argon2id } from '$lib/server/auth/password';

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
