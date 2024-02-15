import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import prisma from '$lib/server/prisma';
import { dev } from '$app/environment';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			email: attributes.email
		};
	}
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
}
