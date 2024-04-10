import { dev } from '$app/environment';
import { TURSO_AUTH_TOKEN, DATABASE_URL } from '$env/static/private';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const dbClient = createClient({ url: DATABASE_URL, authToken: TURSO_AUTH_TOKEN });
const db = drizzle(dbClient, {
	logger: dev,
	schema: schema
});

export { dbClient, db };
