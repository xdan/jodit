/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export const keepNames = new Map<Function, string>();

export const getClassName = (obj: object): string => {
	if (keepNames.has(obj.constructor)) {
		return keepNames.get(obj.constructor) as string;
	}

	if (obj.constructor.name) {
		return obj.constructor.name;
	}

	const regex = new RegExp(/^\s*function\s*(\S*)\s*\(/);

	const res = obj.constructor.toString().match(regex);

	return res ? res[1] : '';
};
