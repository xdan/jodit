/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Extract plain text from HTML text
 *
 * @param html
 */
export const stripTags = (html: string): string => {
    const tmp: HTMLDivElement = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || '';
};
