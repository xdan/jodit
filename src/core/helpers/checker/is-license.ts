/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export const isLicense = (license: any): boolean =>
    typeof license === 'string' &&
    license.length === 32 &&
    /^[a-z0-9]+$/.test(license);
