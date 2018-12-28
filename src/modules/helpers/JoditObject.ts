/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { extend } from './extend';

export class JoditObject {
    constructor(data: any) {
        extend(true, this, data);
    }
}
