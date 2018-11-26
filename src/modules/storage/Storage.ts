/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { camelCase } from '../Helpers';
import { IStorage } from '../../types';

export class Storage {
    public prefix: string = 'Jodit_';

    public set(key: string, value: string | number) {
        this.provider.set(camelCase(this.prefix + key), value);
    }

    public get(key: string): string | null {
        return this.provider.get(camelCase(this.prefix + key));
    }
    constructor(readonly provider: IStorage) {}
}
