import { env } from '$env/dynamic/private';
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
	region: 'auto',
	endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	credentials: {
		accessKeyId: env.R2_ACCESS_KEY,
		secretAccessKey: env.R2_SECRET_KEY
	}
});

export default s3Client;
