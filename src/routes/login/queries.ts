import prisma from '$lib/prisma';
import bcrypt from 'bcryptjs';

export async function login(email: string, password: string) {
	const account = await prisma.account.findUnique({
		where: { email },
		include: { Password: true }
	});

	if (!account || !account.Password) {
		return false;
	}

	const result = await bcrypt.compare(password, account.Password.hash);

	if (!result) {
		return false;
	}

	return account.id;
}
