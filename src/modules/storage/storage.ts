/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IStorage } from '../../types';
import { camelCase } from '../helpers/string';

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
