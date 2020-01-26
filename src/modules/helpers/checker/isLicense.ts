/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export const isLicense = (license: any): boolean =>
    typeof license === 'string' &&
    license.length === 32 &&
    /^[a-z0-9]+$/.test(license);
