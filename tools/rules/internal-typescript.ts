/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import { removeAsserts } from '../utils/transformers/remove-asserts';

import path from 'path';
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
		superDirname,
		uglify
	}: Variables,
	cwd: string
): RuleSetRule => {
	const transpileOnly = !generateTypes;
	const useSwc = transpileOnly;

	return {
		test: /\.(js|ts)$/,
		use: [
			useSwc
				? {
						loader: 'swc-loader',
						options: {
							jsc: {
								parser: {
									syntax: 'typescript',
									decorators: true
								},
								target: ES,
								transform: {
									legacyDecorator: true,
									decoratorMetadata: false
								},
								externalHelpers: true
							},
							minify: false
						}
					}
				: {
						loader: 'ts-loader',
						options: {
							transpileOnly: false,
							allowTsInNodeModules: true,
							onlyCompileBundledFiles: true,
							compilerOptions: {
								allowJs: true,
								target: ES,
								declaration: true,
								declarationDir: path.resolve(
									dirname,
									'./build/types'
								)
							},
							getCustomTransformers: () => ({
								before:
									isProd && !isTest ? [removeAsserts()] : []
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
