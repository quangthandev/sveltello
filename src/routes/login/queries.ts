import prisma from '$lib/prisma';
import { Argon2id } from 'oslo/password';

export async function login(email: string, password: string) {
	const user = await prisma.user.findUnique({
		where: { email }
	});

	if (!user) {
		return false;
	}

	const validPassword = await new Argon2id().verify(user.password, password);

	if (!validPassword) {
		return false;
	}

	return user.id;
}
