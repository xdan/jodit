/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2025 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
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
		superDirname,
		uglify,
		forceSwc
	}: Variables,
	cwd: string
): RuleSetRule => {
	const useSWC = (isProd && !isTest && !generateTypes) || forceSwc;
	if (useSWC) {
		console.info('Use SWC');
	}

	const loader = useSWC
		? {
				loader: 'swc-loader',
				options: {
					jsc: {
						target: ES,
						parser: {
							syntax: 'typescript',
							tsx: false,
							dynamicImport: false,
							decorators: true
						}
						// externalHelpers: true
					},
					minify: uglify
				}
			}
		: {
				loader: 'ts-loader',
				options: {
					transpileOnly: isProd && !isTest && !generateTypes,
					allowTsInNodeModules: true,
					onlyCompileBundledFiles: true,
					compilerOptions: {
						allowJs: true,
						target: ES,
						declaration: true,
						declarationDir: path.resolve(dirname, './build/types')
					},
					getCustomTransformers: (): unknown => ({
						before: isProd && !isTest ? [removeAsserts()] : []
					})
				}
			};

	return {
		test: /\.(js|ts)$/,
		use: [
			loader,
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
