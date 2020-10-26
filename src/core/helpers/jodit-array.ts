/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { markAsAtomic } from './extend';
import { error } from './type';

/**
 * @deprecated Use `Jodit.atom` instead
 */
export function JoditArray(data: any[]) {
	if (!isProd) {
		throw error('Deprecated class. Use `Jodit.atom` instead');
	}

	markAsAtomic(data);

	return data;
}
