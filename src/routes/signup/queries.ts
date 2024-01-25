import prisma from '$lib/prisma';
import bcrypt from 'bcryptjs';

export async function accountExists(email: string) {
	const account = await prisma.account.findUnique({
		where: { email },
		select: { id: true }
	});

	return Boolean(account);
}

export async function createAccount(email: string, password: string) {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	return prisma.account.create({
		data: {
			email: email,
			Password: { create: { hash, salt } }
		}
	});
}
