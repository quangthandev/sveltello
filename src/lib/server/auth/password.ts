/// Reference: https://github.com/pilcrowonpaper/oslo/blob/main/src/password/argon2id.ts

import { hash, verify } from '@node-rs/argon2';

const v0x13 = 1;
const MEMORY_SIZE = 19456;
const ITERATIONS = 2;
const TAG_LENGTH = 32;
const PARALLELISM = 1;

interface PasswordHashingAlgorithm {
	hash(password: string): Promise<string>;
	verify(hash: string, password: string): Promise<boolean>;
}

export class Argon2id implements PasswordHashingAlgorithm {
	constructor(options?: {
		memorySize?: number;
		iterations?: number;
		tagLength?: number;
		parallelism?: number;
		secret?: ArrayBuffer;
	}) {
		this.memorySize = options?.memorySize ?? MEMORY_SIZE;
		this.iterations = options?.iterations ?? ITERATIONS;
		this.tagLength = options?.tagLength ?? TAG_LENGTH;
		this.parallelism = options?.parallelism ?? PARALLELISM;
		this.secret = options?.secret ?? null;
	}

	private memorySize?: number;
	private iterations?: number;
	private tagLength?: number;
	private parallelism?: number;
	private secret: ArrayBuffer | null;

	public async hash(password: string): Promise<string> {
		return await hash(password.normalize('NFKC'), {
			memoryCost: this.memorySize,
			timeCost: this.iterations,
			outputLen: this.tagLength,
			parallelism: this.parallelism,
			version: v0x13,
			secret: this.secret ? Buffer.from(this.secret) : undefined
		});
	}

	public async verify(hash: string, password: string): Promise<boolean> {
		return await verify(hash, password.normalize('NFKC'), {
			memoryCost: this.memorySize,
			timeCost: this.iterations,
			outputLen: this.tagLength,
			parallelism: this.parallelism,
			version: v0x13,
			secret: this.secret ? Buffer.from(this.secret) : undefined
		});
	}
}
