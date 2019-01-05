/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

/**
 * Split separated elements
 *
 * @param a
 */
export const splitArray = (a: any[] | string): any[] =>
    typeof a === 'string' ? a.split(/[,\s]+/) : a;