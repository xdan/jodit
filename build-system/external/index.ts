/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';

export default (vars: Variables): { [key in string]: string } => ({
	...require('./exclude-utils')(vars),
	...require('./exclude-plugins')(vars),
	...require('./exclude-languages')(vars)
});
