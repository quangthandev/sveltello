import clsx, { type ClassValue } from 'clsx';
import type { Readable } from 'svelte/motion';
import { twMerge } from 'tailwind-merge';

export function cn(...args: ClassValue[]): string {
	return twMerge(clsx(args));
}

export function formatTimestamp(timestamp: Date): string {
	return new Date(timestamp).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	});
}

export function noop() {}

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (v: unknown): v is Function => typeof v === 'function';

export function isHTMLElement(element: unknown): element is HTMLElement {
	return element instanceof HTMLElement;
}

export function isObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === 'object';
}

export function isReadable(value: unknown): value is Readable<unknown> {
	return isObject(value) && 'subscribe' in value;
}
