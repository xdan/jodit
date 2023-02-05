/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/checker
 */

import type { IJodit } from 'jodit/types';
import { isFunction } from './is-function';

/**
 * Check if element is instance of Jodit
 */
export function isJoditObject(jodit: unknown): jodit is IJodit {
	return Boolean(
		jodit &&
			jodit instanceof Object &&
			isFunction(jodit.constructor) &&
			// @ts-ignore
			((typeof Jodit !== 'undefined' && jodit instanceof Jodit) ||
				(jodit as IJodit).isJodit)
	);
}
