/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import type { RuleSetRule } from 'webpack';
import * as path from 'path';

export default ({ ES }: Variables): RuleSetRule => {
	return {
		test: /\.(js|ts)$/,
		loader: 'ts-loader',
		options: {
			transpileOnly: true,
			allowTsInNodeModules: true,
			compilerOptions: {
				target: ES
			}
		},
		include: [/node_modules/],
		exclude: [/src\/langs\/.*\.js$/]
	};
};
