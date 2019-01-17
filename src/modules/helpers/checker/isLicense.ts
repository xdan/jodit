/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

export const isLicense = (license: any): boolean =>
    typeof license === 'string' &&
    license.length === 32 &&
    /^[a-z0-9]+$/.test(license);
