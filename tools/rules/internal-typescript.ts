/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import { removeAsserts } from '../utils/transformers/remove-asserts';

import * as path from 'path';
import * as ts from 'typescript';
import type { RuleSetRule } from 'webpack';

export default (
	{
		dirname,
		ES,
		ESModern,
		generateTypes,
		isProd,
		isTest,
		fat,
		superDirname
	}: Variables,
	cwd: string
): RuleSetRule => {
	return {
		test: /\.(js|ts)$/,
		use: [
			{
				loader: 'ts-loader',
				options: {
					transpileOnly: isProd && !isTest && !generateTypes,
					allowTsInNodeModules: true,
					compilerOptions: {
						allowJs: true,
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
					POLYFILLS: !ESModern,
					FAT: fat
				}
			}
		],
		include: [path.resolve(cwd, './src/')],
		exclude: [path.resolve(superDirname, './src/langs')]
	};
};
