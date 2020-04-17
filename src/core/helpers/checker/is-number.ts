/**
 * Check value is a number
 * @param value
 */
export function isNumber(value: unknown): value is number {
	return typeof value === 'number' && !isNaN(value) && isFinite(value);
}
