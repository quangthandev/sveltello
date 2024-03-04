import clsx, { type ClassValue } from 'clsx';
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

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
