import { env } from '$env/dynamic/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const dbClient = createClient({ url: env.DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });
const db = drizzle(dbClient, {
	logger: false,
	schema: schema
});

export { dbClient, db };
