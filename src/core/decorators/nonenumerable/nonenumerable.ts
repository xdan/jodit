/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:core/decorators/nonenumerable/README.md]]
 * @packageDocumentation
 * @module decorators/nonenumerable
 */

export const nonenumerable = (target: object, propertyKey: string): void => {
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
