/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/utils
 */

/**
 * Module returns method that is used to determine the browser
 * @example
 * ```javascript
 * console.log(Jodit.modules.Helpers.browser('mse'));
 * console.log(Jodit.modules.Helpers.browser('chrome'));
 * console.log($Jodit.modules.Helpers.browser('opera'));
 * console.log(Jodit.modules.Helpers.browser('firefox'));
 * console.log(Jodit.modules.Helpers.browser('mse') && Jodit.modules.Helpers.browser('version') > 10);
 * ```
 */
export const browser = (browser: string): boolean | string => {
	const ua: string = navigator.userAgent.toLowerCase(),
		match: any =
			/(firefox)[\s/]([\w.]+)/.exec(ua) ||
			/(chrome)[\s/]([\w.]+)/.exec(ua) ||
			/(webkit)[\s/]([\w.]+)/.exec(ua) ||
			/(opera)(?:.*version)[\s/]([\w.]+)/.exec(ua) ||
			/(msie)[\s]([\w.]+)/.exec(ua) ||
			/(trident)\/([\w.]+)/.exec(ua) ||
			ua.indexOf('compatible') < 0 ||
			[];

	if (browser === 'version') {
		return match[2];
	}

	if (browser === 'webkit') {
		return match[1] === 'chrome' || match[1] === 'webkit';
	}

	if (browser === 'ff') {
		return match[1] === 'firefox';
	}

	if (browser === 'msie') {
		return match[1] === 'trident' || match[1] === 'msie';
	}

	return match[1] === browser;
};
