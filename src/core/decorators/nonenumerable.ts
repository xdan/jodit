/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @enumerable decorator that sets the enumerable property of a class field to false.
 * @param value true|false
 */
export const nonenumerable = (target: any, propertyKey: string) => {
	const descriptor =
		Object.getOwnPropertyDescriptor(target, propertyKey) || {};

	if (descriptor.enumerable !== false) {
		Object.defineProperty(target, propertyKey, {
			enumerable: false,
			set(value: any) {
				Object.defineProperty(this, propertyKey, {
					enumerable: false,
					writable: true,
					value
				});
			}
		});
	}
};
