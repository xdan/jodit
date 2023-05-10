/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import type { RuleSetRule } from 'webpack';
import * as path from 'path';

export default (_: Variables): RuleSetRule => {
	return {
		test: /\.(js)$/,
		use: [
			{
				loader: path.resolve(__dirname, '../loaders/lang-loader.ts')
			}
		],
		include: [/src\/langs\/.*/]
	};
};
