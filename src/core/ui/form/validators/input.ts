/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { IUIInput, IUIInputValidator } from '../../../../types';
import { isURL, trim } from '../../../helpers';

/**
 * Input is required
 * @param input
 */
export const required = <IUIInputValidator>function (input: IUIInput): boolean {
	if (!trim(input.value).length) {
		input.error = 'Please fill out this field';
		return false;
	}

	return true;
};

/**
 * Input value should be valid URL
 * @param input
 */
export const url = <IUIInputValidator>function (input: IUIInput): boolean {
	if (!isURL(trim(input.value))) {
		input.error = 'Please enter a web address';
		return false;
	}

	return true;
};
