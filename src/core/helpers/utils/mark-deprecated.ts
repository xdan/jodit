/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

/**
 * By default terser will remove all `console.*` but
 * if you use this object it will not be
 */
export const cns = console;

/**
 * Mark function as deprecated
 */
export function markDeprecated(
	method: Function,
	names: string[] = [''],
	ctx: any = null
) {
	return (...args: any[]): void => {
		cns.warn(
			`Method "${names[0]}" deprecated.` +
				(names[1] ? ` Use "${names[1]}" instead` : '')
		);
		return method.call(ctx, ...args);
	};
}
