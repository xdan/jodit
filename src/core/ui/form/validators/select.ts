/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IUISelect } from '../../../../types';
import { trim } from '../../../helpers';
import { IUISelectValidator } from '../../../../types';

/**
 * Select is required
 * @param input
 */
export const required = <IUISelectValidator>function (select: IUISelect): boolean {
	if (!trim(select.value).length) {
		select.error = 'Please fill out this field';
		return false;
	}

	return true;
};
