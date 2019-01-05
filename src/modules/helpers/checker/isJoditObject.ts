/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { IJodit } from '../../../types';

/**
 * Check if element is instance of Jodit
 *
 *
 */
export const isJoditObject = (jodit: unknown): jodit is IJodit  => {
    if (jodit && jodit instanceof Object && typeof jodit.constructor === 'function' && jodit.constructor.name === 'Jodit') {
        return true;
    }

    return false;
};
