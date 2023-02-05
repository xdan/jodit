/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import type { IViewBased } from 'jodit/types';
import { isFunction } from './is-function';

/**
 * Check if element is instance of View
 */
export function isViewObject(jodit: unknown): jodit is IViewBased {
	return Boolean(
		jodit &&
			jodit instanceof Object &&
			isFunction(jodit.constructor) &&
			(jodit as IViewBased).isView
	);
}
