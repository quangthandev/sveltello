// Reference: https://github.com/sveltejs/kit/issues/7161
import type { SubmitFunction } from '@sveltejs/kit';

type SuccessData<T> =
	T extends Record<string, unknown> ? (T extends { invalid: boolean } ? never : T) : never;
type InvalidData<T> =
	T extends Record<string, unknown> ? (T extends { invalid: boolean } ? T : never) : never;
export type TypedSubmitFunction<T> = SubmitFunction<SuccessData<T>, InvalidData<T>>;
