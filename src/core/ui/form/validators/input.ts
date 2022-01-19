/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module ui/form
 */

import type { IUIInput, IUIInputValidator } from 'jodit/types';
import { isURL, trim } from 'jodit/core/helpers';

/**
 * Input is required
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
 */
export const url = <IUIInputValidator>function (input: IUIInput): boolean {
	if (!isURL(trim(input.value))) {
		input.error = 'Please enter a web address';
		return false;
	}

	return true;
};
