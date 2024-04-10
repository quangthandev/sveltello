import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

export default {
	schema: './src/lib/server/drizzle/schema.ts',
	driver: 'turso',
	out: './src/lib/server/drizzle/data',
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
		authToken: process.env.TURSO_AUTH_TOKEN as string
	},
	// Print all statements
	verbose: true,
	// Always ask for confirmation
	strict: true
} satisfies Config;
