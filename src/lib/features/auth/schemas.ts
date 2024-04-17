import { createInsertSchema } from 'drizzle-zod';
import { user } from '$lib/drizzle/schema';

export const authCredentialsSchema = createInsertSchema(user, {
	email: (schema) => schema.email.email({ message: 'Please enter a valid email address.' }),
	password: (schema) =>
		schema.password.min(8, { message: 'Password must be at least 8 characters long.' })
});
