/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

export const inArray = (
    needle: string | number,
    haystack: Array<number | string>
): boolean => haystack.indexOf(needle) !== -1;
