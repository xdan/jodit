/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { SPACE_REG_EXP_END, SPACE_REG_EXP_START } from '../../../constants';

/**
 * It clears the line of all auxiliary invisible characters , from the spaces and line breaks , tabs
 * from the beginning and end of the line
 *
 * @param {string} value input string
 * @return {string}
 */
export const trim = (value: string): string => {
    return value
        .replace(SPACE_REG_EXP_START, '')
        .replace(SPACE_REG_EXP_END, '');
};
