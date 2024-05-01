// Reference: https://github.com/sveltejs/kit/issues/7161
import type { SubmitFunction } from '@sveltejs/kit';

type SuccessData<T> =
	T extends Record<string, unknown> ? (T extends { invalid: boolean } ? never : T) : never;
type InvalidData<T> =
	T extends Record<string, unknown> ? (T extends { invalid: boolean } ? T : never) : never;
export type TypedSubmitFunction<T> = SubmitFunction<SuccessData<T>, InvalidData<T>>;

// Reference: https://stackoverflow.com/questions/60323726/typescript-add-one-argument-to-a-functions-params
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AddParameters<TFunction extends (...args: any) => any, TParameters extends [...args: any]> = (
	...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>;

type SubmitFunctionWithCallback<
	Success extends Record<string, unknown> | undefined = Record<string, unknown>,
	Failure extends Record<string, unknown> | undefined = Record<string, unknown>
> = AddParameters<
	SubmitFunction<Success, Failure>,
	[
		{
			onSuccess?: (data?: Success) => void;
			onFailure?: (data?: Failure) => void;
		}
	]
>;
export type TypedSubmitFunctionWithCallback<T> = SubmitFunctionWithCallback<
	SuccessData<T>,
	InvalidData<T>
>;
