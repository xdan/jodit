/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/form
 */

import type { IUIInputValidator } from 'jodit/types';
import { trim } from 'jodit/core/helpers/string/trim';

/**
 * Select is required
 */
export const required = <IUIInputValidator>function (select): boolean {
	if (!trim(select.value).length) {
		select.error = 'Please fill out this field';
		return false;
	}

	return true;
};
