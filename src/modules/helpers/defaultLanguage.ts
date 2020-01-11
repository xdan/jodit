/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Try define user language
 *
 * @param language
 * @param defaultLanguage
 */
export const defaultLanguage = (language?: string, defaultLanguage: string = 'en'): string => {
	if (language !== 'auto' && typeof language === 'string') {
		return language;
	}

	if (document.documentElement && document.documentElement.lang) {
		return document.documentElement.lang;
	}

	if (navigator.language) {
		return navigator.language.substr(0, 2)
	}

	return defaultLanguage;
};
