/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';

export default ({ isProd, isTest }: Variables): { [key in string]: string } => {
	return isProd && !isTest
		? {
				'jodit/core/helpers/utils/assert': 'export {assert(){}};',
				'./assert': 'export {assert(){}};'
			}
		: {};
};
