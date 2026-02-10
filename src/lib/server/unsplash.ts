import { env } from '$env/dynamic/private';
import { createApi } from 'unsplash-js';

export const unsplash = createApi({
	accessKey: env.UNSPLASH_ACCESS_KEY,
	fetch: fetch
});
