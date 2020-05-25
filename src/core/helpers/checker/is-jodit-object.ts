/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit, IViewBased } from '../../../types';
import { isFunction } from './is-function';

/**
 * Check if element is instance of Jodit
 */
export function isJoditObject(jodit: unknown): jodit is IJodit {
	return Boolean(
		jodit &&
			jodit instanceof Object &&
			isFunction(jodit.constructor) &&
			(jodit instanceof Jodit || (jodit as IJodit).isJodit)
	);
}

/**
 * Check if element is instance of View
 */
export function isViewObject(jodit: unknown): jodit is IViewBased {
	return Boolean(
		jodit &&
			jodit instanceof Object &&
			isFunction(jodit.constructor) &&
			(jodit instanceof Jodit.modules.View ||
				(jodit as IViewBased).isView)
	);
}
