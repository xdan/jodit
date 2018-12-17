/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

/**
 * Module returns method that is used to determine the browser
 * @params {Object} parent main Jodit object
 * @example
 * ```javascript
 * console.log(editor.helper.browser('mse'));
 * console.log(editor.helper.browser('chrome'));
 * console.log($editor.helper.browser('opera'));
 * console.log(editor.helper.browser('firefox'));
 * console.log(editor.helper.browser('mse') && editor.helper.browser('version') > 10);
 * ```
 */
export const browser = (browser: string): boolean | string => {
    const ua: string = navigator.userAgent.toLowerCase(),
        match: any =
            /(firefox)[\s\/]([\w.]+)/.exec(ua) ||
            /(chrome)[\s\/]([\w.]+)/.exec(ua) ||
            /(webkit)[\s\/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version)[\s\/]([\w.]+)/.exec(ua) ||
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