/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugin
 */

import { kebabCase } from 'jodit/core/helpers/string/kebab-case';

/**
 * @private
 */
export function normalizeName(name: string): string {
	return kebabCase(name).toLowerCase();
}
