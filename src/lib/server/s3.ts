import { env } from '$env/dynamic/private';
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
	region: env.S3_REGION,
	endpoint: env.S3_API_ENDPOINT,
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY,
		secretAccessKey: env.S3_SECRET_KEY
	},
	forcePathStyle: env.S3_FORCE_PATH_STYLE === 'true',
	requestChecksumCalculation: 'WHEN_REQUIRED',
	responseChecksumValidation: 'WHEN_REQUIRED'
});

export default s3Client;
