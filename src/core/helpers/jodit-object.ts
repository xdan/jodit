/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { error } from './type';
import { markAsAtomic } from './extend';

/**
 * @deprecated Use `Jodit.atom` instead
 */
export function JoditObject<T>(data: T): T {
	if (!isProd) {
		throw error('Deprecated class. Use `Jodit.atom` instead');
	}

	markAsAtomic(data);

	return data;
}
