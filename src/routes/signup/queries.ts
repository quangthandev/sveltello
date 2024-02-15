import prisma from '$lib/server/prisma';
import { Argon2id } from 'oslo/password';

export async function userExists(email: string) {
	const user = await prisma.user.findUnique({
		where: { email },
		select: { id: true }
	});

	return Boolean(user);
}

export async function createUser(email: string, password: string) {
	const hashedPassword = await new Argon2id().hash(password);

	return prisma.user.create({
		data: {
			email: email,
			password: hashedPassword
		}
	});
}
