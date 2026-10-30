import { error, json } from '@sveltejs/kit';
import { z } from 'zod';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '$lib/server/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$env/dynamic/private';
import { createAttachment, getItem, makeCover } from '$lib/features/items/db-queries';
import { checkAuthUser } from '$lib/server/auth';

const uploadSchema = z.object({
	file: z.instanceof(File)
});

export async function POST({ request, params, locals }) {
	checkAuthUser(locals);

	if (!params.id) {
		error(422, 'Item ID is required');
	}

	let formData: FormData;

	try {
		formData = await request.formData();
	} catch (e) {
		error(422, 'Invalid request');
	}

	const result = await uploadSchema.safeParseAsync(Object.fromEntries(formData));

	if (!result.success) {
		error(422, 'File is required');
	}

	const file = result.data.file;
	const fileName = file.name;
	const fileType = file.type;

	const objectKey = `${Date.now().toString()}-${crypto.randomUUID()}-${slugifyString(fileName)}`;

	try {
		const command = new PutObjectCommand({
			Bucket: env.S3_BUCKET_NAME,
			Key: objectKey,
			ContentType: fileType,
			ACL: 'public-read'
		});

		const presignedUrl = await getSignedUrl(s3Client, command, {
			expiresIn: 300
		});

		const response = await fetch(presignedUrl, {
			method: 'PUT',
			headers: { 'Content-Type': fileType },
			body: file
		});

		if (!response.ok) {
			const details = await response.text();
			console.error('Garage upload failed', response.status, details, presignedUrl);
			error(500, 'Failed to upload image');
		}

		const url = `${env.S3_PUBLIC_BUCKET_URL}/${objectKey}`;

		await createAttachment(params.id, fileName, fileType, url);

		// Make the attachment as cover if it's the first attachment, ...
		// ... and the item doesn't have a cover yet, and the file is an image
		const item = await getItem(params.id, locals.user.id);
		if (
			item &&
			item.attachments.length === 1 &&
			item.cover === null &&
			fileType.startsWith('image/')
		) {
			await makeCover(params.id, locals.user.id, {
				source: 'attachment',
				attachmentId: item.attachments[0].id
			});
		}

		return json({ url });
	} catch (e) {
		console.log(e);
		error(500, 'Server error');
	}
}

const slugifyString = (str: string) => {
	return str
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/\./g, '-')
		.replace(/-+/g, '-')
		.replace(/[^a-z0-9-]/g, '-');
};
