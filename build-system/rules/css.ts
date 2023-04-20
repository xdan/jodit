/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import type { RuleSetRule } from 'webpack';

export default (vars: Variables): RuleSetRule => {
	return {
		test: /\.(less|css)$/,
		use: require('../loaders/style')(vars)
	};
};
