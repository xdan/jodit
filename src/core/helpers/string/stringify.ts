import { CanUndef } from '../../../types';

/**
 * Safe stringify circular object
 * @param value
 */
export function stringify(value: any) {
	if (typeof value !== 'object') {
		return value.toString ? value.toString() : value;
	}

	const map = new WeakMap();

	const r = (k: string, v: any): CanUndef<string> => {
		if (typeof v === 'object' && v !== null) {
			if (map.get(v)) {
				return '[refObject]';
			}

			map.set(v, true);
		}

		return v;
	};

	return JSON.stringify(value, r);
}
