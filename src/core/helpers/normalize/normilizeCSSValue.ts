/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
