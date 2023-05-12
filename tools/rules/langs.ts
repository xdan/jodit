/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import type { RuleSetRule } from 'webpack';
import * as path from 'path';

export default ({ superDirname }: Variables): RuleSetRule => {
	return {
		test: /\.(js)$/,
		use: [
			{
				loader: path.resolve(
					superDirname,
					'./tools/loaders/lang-loader.ts'
				)
			},
			{
				loader: path.resolve(
					superDirname,
					'./tools/loaders/debug-loader.ts'
				),
				options: {
					group: 'langs'
				}
			}
		],
		include: [path.resolve(superDirname, './src/langs')]
	};
};
