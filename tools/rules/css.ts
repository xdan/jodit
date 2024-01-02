/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import type { RuleSetRule } from 'webpack';
import style from '../loaders/style';

export default (vars: Variables): RuleSetRule => {
	return {
		test: /\.(less|css)$/,
		use: style(vars)
	};
};
