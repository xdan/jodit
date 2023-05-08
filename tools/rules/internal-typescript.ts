/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import type { RuleSetRule } from 'webpack';
import { removeAsserts } from '../utils/transformers/remove-asserts';
import * as path from 'path';
import * as ts from 'typescript';

export default ({
	superDirname,
	dirname,
	ES,
	generateTypes,
	isProd,
	isTest
}: Variables): RuleSetRule => {
	return {
		test: /\.ts$/,
		use: [
			{
				loader: 'ts-loader',
				options: {
					transpileOnly: isProd && !isTest && !generateTypes,
					allowTsInNodeModules: true,
					compilerOptions: {
						target: ES,
						declaration: true,
						declarationDir: path.resolve(dirname, './build/types')
					},
					getCustomTransformers: (program: ts.Program) => ({
						before: isProd && !isTest ? [removeAsserts()] : []
					})
				}
			}
		],
		include: [path.resolve(superDirname, './src/')],
		exclude: [/langs\/[a-z]{2}\.ts/, /langs\/[a-z]{2}_[a-z]{2}\.ts/]
	};
};
