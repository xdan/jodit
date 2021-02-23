/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IUIInputValidator } from '../../../../types';
import { trim } from '../../../helpers';

/**
 * Select is required
 * @param input
 */
export const required = <IUIInputValidator>function (select): boolean {
	if (!trim(select.value).length) {
		select.error = 'Please fill out this field';
		return false;
	}

	return true;
};
