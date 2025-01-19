/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

import { globalDocument } from 'jodit/core/constants';
import { isString } from 'jodit/core/helpers/checker/is-string';

/**
 * Try define user language
 */
export const defaultLanguage = (
	language?: string,
	defaultLanguage: string = 'en'
): string => {
	if (language !== 'auto' && isString(language)) {
		return language;
	}

	if (globalDocument.documentElement && globalDocument.documentElement.lang) {
		return globalDocument.documentElement.lang;
	}

	if (navigator.language) {
		return navigator.language.substring(0, 2);
	}

	return defaultLanguage;
};
