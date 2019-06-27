/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { isNumeric } from '../checker/isNumeric';

export const normilizeCSSValue = (
    key: string,
    value: string | number
): string | number => {
    switch (key.toLowerCase()) {
        case 'font-weight':
            switch (value.toString().toLowerCase()) {
                case 'bold':
                    return 700;
                case 'normal':
                    return 400;
                case 'heavy':
                    return 900;
            }

            return isNumeric(value) ? +value : value;
    }

    return value;
};
