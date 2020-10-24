/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { extend } from './extend';
import { error } from './type';

/**
 * @deprecated Use `Jodit.atom` instead
 */
export class JoditObject {
	constructor(data: any) {
		if (!isProd) {
			error('Deprecated class. Use `Jodit.atom` instead');
		}

		extend(true, this, data);
	}
}
