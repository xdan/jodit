/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IJodit } from '../../../types';

/**
 * Check if element is instance of Jodit
 */
export const isJoditObject = (jodit: unknown): jodit is IJodit => {
	if (
		jodit &&
		jodit instanceof Object &&
		typeof jodit.constructor === 'function' &&
		(jodit instanceof Jodit || (jodit as IJodit).isJodit)
	) {
		return true;
	}

	return false;
};

import { Jodit } from '../../../Jodit';
