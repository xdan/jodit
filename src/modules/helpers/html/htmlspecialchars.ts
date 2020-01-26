/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Convert special characters to HTML entities
 *
 * @method htmlspecialchars
 * @param {string} html
 * @return {string}
 */
export const htmlspecialchars = (html: string): string => {
    const tmp = document.createElement('div');
    tmp.textContent = html;
    return tmp.innerHTML;
};
