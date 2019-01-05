/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
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