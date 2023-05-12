/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import type { RuleSetRule } from 'webpack';
import * as path from 'path';

export default ({
	ESModern,
	ES,
	dirname,
	superDirname
}: Variables): RuleSetRule => {
	return {
		test: /\.(js|ts)$/,
		use: [
			{
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
					allowTsInNodeModules: true,
					compilerOptions: {
						allowJs: true,
						target: ES,
						skipLibCheck: true
					}
				}
			},
			{
				loader: path.resolve(
					superDirname,
					'./tools/loaders/process-sections.ts'
				),
				options: {
					POLYFILLS: !ESModern
				}
			},
			{
				loader: path.resolve(
					superDirname,
					'./tools/loaders/debug-loader.ts'
				),
				options: {
					group: 'extra'
				}
			}
		],

		include: [path.resolve(dirname, './node_modules/')],
		exclude: [path.resolve(superDirname, './src/langs/')]
	};
};
