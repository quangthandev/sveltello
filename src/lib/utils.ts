import { type ClassValue, clsx } from 'clsx';
import type { Readable } from 'svelte/motion';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatTimestamp(timestamp: Date | string): string {
	return new Date(timestamp).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true
	});
}

type RelativeTimeUnit = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';
// in miliseconds
const units: Record<RelativeTimeUnit, number> = {
	year: 24 * 60 * 60 * 1000 * 365,
	month: (24 * 60 * 60 * 1000 * 365) / 12,
	day: 24 * 60 * 60 * 1000,
	hour: 60 * 60 * 1000,
	minute: 60 * 1000,
	second: 1000
} as const;

export function getRelativeTime(d1: Date | string, d2 = new Date()) {
	const elapsed = new Date(d1).getTime() - d2.getTime();

	for (const unit of Object.keys(units) as RelativeTimeUnit[]) {
		// "Math.abs" accounts for both "past" & "future" scenarios
		if (Math.abs(elapsed) > units[unit] || unit === 'second')
			return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
				Math.round(elapsed / units[unit]),
				unit
			);
	}
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

/**
 * A type alias for a general event listener function.
 *
 * @template E - The type of event to listen for
 * @param evt - The event object
 * @returns The return value of the event listener function
 */
export type GeneralEventListener<E = Event> = (evt: E) => unknown;

/**
 *  Overloaded function signatures for addEventListener
 */
export function addEventListener<E extends keyof HTMLElementEventMap>(
	target: Window,
	event: E,
	handler: (this: Window, ev: HTMLElementEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<E extends keyof HTMLElementEventMap>(
	target: Document,
	event: E,
	handler: (this: Document, ev: HTMLElementEventMap[E]) => unknown,
	options?: boolean | AddEventListenerOptions
): VoidFunction;

export function addEventListener<E extends keyof HTMLElementEventMap>(
	target: EventTarget,
	event: E,
	handler: GeneralEventListener<HTMLElementEventMap[E]>,
	options?: boolean | AddEventListenerOptions
): VoidFunction;
/**
 * Adds an event listener to the specified target element(s) for the given event(s), and returns a function to remove it.
 * @param target The target element(s) to add the event listener to.
 * @param event The event(s) to listen for.
 * @param handler The function to be called when the event is triggered.
 * @param options An optional object that specifies characteristics about the event listener.
 * @returns A function that removes the event listener from the target element(s).
 */
export function addEventListener(
	target: Window | Document | EventTarget,
	event: string | string[],
	handler: EventListenerOrEventListenerObject,
	options?: boolean | AddEventListenerOptions
) {
	const events = Array.isArray(event) ? event : [event];

	// Add the event listener to each specified event for the target element(s).
	events.forEach((_event) => target.addEventListener(_event, handler, options));

	// Return a function that removes the event listener from the target element(s).
	return () => {
		events.forEach((_event) => target.removeEventListener(_event, handler, options));
	};
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};
