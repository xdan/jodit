/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export const defaultLanguage = (language?: string): string =>
	language === 'auto' || language === undefined
		? (document.documentElement && document.documentElement.lang) ||
		  (navigator.language && navigator.language.substr(0, 2)) ||
		  ((navigator as any).browserLanguage
				? (navigator as any).browserLanguage.substr(0, 2)
				: false) ||
		  'en'
		: language;
