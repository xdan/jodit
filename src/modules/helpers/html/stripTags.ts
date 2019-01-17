/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
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