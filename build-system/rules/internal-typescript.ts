/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import type { RuleSetRule } from 'webpack';
import { removeAsserts } from '../utils/remove-asserts';
import * as path from 'path';

export default ({
	superDirname,
	ES,
	isProd,
	isTest
}: Variables): RuleSetRule => {
	return {
		test: /\.ts$/,
		use: [
			{
				loader: 'ts-loader',
				options: {
					transpileOnly: isProd && !isTest,
					allowTsInNodeModules: true,
					compilerOptions: {
						target: ES
					},
					getCustomTransformers: () => ({
						before: isProd && !isTest ? [removeAsserts()] : []
					})
				}
			}
		],
		include: [path.resolve(superDirname, './src/')],
		exclude: [/langs\/[a-z]{2}\.ts/, /langs\/[a-z]{2}_[a-z]{2}\.ts/]
	};
};
