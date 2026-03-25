import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLocaleLowerCase();

	return token;
}

export function encodeSessionToken(token: string) {
	return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}
