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
	ESModern,
	generateTypes,
	isProd,
	isTest
}: Variables): RuleSetRule => {
	return {
		test: /\.(js|ts)$/,
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
			},
			{
				loader: path.resolve(
					superDirname,
					'./tools/loaders/process-sections.ts'
				),
				options: {
					POLYFILLS: !ESModern
				}
			}
		],
		include: [path.resolve(dirname, './src/')],
		exclude: [/src\/langs\/.*\.js$/]
	};
};
