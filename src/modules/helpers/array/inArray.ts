/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

export const inArray = (
    needle: string | number,
    haystack: Array<number | string>
): boolean => haystack.indexOf(needle) !== -1;
