/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
