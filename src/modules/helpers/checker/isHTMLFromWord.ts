/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * Detect if string is HTML from MS Word or Excel
 *
 * @param {string} data
 * @return {boolean}
 */
export const isHTMLFromWord = (data: string): boolean => {
    return (
        data.search(/<meta.*?Microsoft Excel\s[\d].*?>/) !== -1 ||
        data.search(/<meta.*?Microsoft Word\s[\d].*?>/) !== -1 ||
        (data.search(/style="[^"]*mso-/) !== -1 && data.search(/<font/) !== -1)
    );
};
