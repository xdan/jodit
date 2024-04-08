/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';

import excludeLanguages from './exclude-languages';
import excludePlugins from './exclude-plugins';
import excludeUtils from './exclude-utils';

export const externals = (vars: Variables): { [key in string]: string } => ({
	...excludeUtils(vars),
	...excludePlugins(vars),
	...excludeLanguages(vars)
});
