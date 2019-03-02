    /*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { trim } from '../string/trim';
import { INVISIBLE_SPACE_REG_EXP } from '../../../constants';

/**
 * Clear HTML
 *
 * @method clear
 * @param {string} value input string
 * @param {boolean} [removeEmptyBlocks] if true remove empty blocks
 * @return {string}
 */
export const clear = (value: string, removeEmptyBlocks = false): string => {
    value = trim(value)
        .replace(INVISIBLE_SPACE_REG_EXP, '')
        .replace(/[\s]*class=""/g, '');

    if (removeEmptyBlocks) {
        value = value.replace(
            /<p[^>]*>[\s\n\r\t]*(&nbsp;|<br>|<br\/>)?[\s\n\r\t]*<\/p>[\n\r]*/g,
            ''
        );
    }

    return value;
};
