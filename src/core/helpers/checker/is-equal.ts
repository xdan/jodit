import { stringify } from '../string/';

/**
 * Check two element are equal
 *
 * @param a
 * @param b
 */
export function isEqual(a: unknown, b: unknown): boolean {
	return a === b || stringify(a) === stringify(b);
}

export function isFastEqual(a: unknown, b: unknown): boolean {
	return a === b;
}
