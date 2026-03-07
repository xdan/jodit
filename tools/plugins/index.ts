/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';

import banner from './banner';
import define from './define';
import extractCSS from './extract-css';
import postBuild from './post-build';

import * as webpack from 'webpack';
import type { WebpackConfiguration } from 'webpack-cli';
import StatoscopeWebpackPlugin from '@statoscope/webpack-plugin';

export const plugins = (vars: Variables): WebpackConfiguration['plugins'] => {
	const {
		isProd,
		isTest,
		ESModern,
		onlyTS,
		debug,
		exclude,
		progressFunction,
		stat
	} = vars;

	const plugins: Array<webpack.ProgressPlugin | webpack.DelegatedPlugin> = [
		define(vars)
	];

	if (stat) {
		plugins.push(
			new webpack.ProgressPlugin(
				progressFunction ? progressFunction : undefined
			)
		);
	}

	if (isProd) {
		if (!onlyTS) {
			plugins.push(extractCSS(vars));
		}

		plugins.push(banner(vars));

		if (!isTest && !ESModern && !onlyTS) {
			plugins.push(postBuild(vars));
		}

		if (vars.statoscope) {
			plugins.push(
				new StatoscopeWebpackPlugin({
					saveReportTo: vars.statoscopeReportPath,
					saveStatsTo: vars.statoscopeStatsPath,
					open: false,
					statsOptions: {
						all: false,
						hash: true,
						entrypoints: true,
						chunks: true,
						chunkModules: true,
						reasons: false,
						ids: true,
						dependentModules: false,
						chunkRelations: true,
						cachedAssets: true,
						nestedModules: true,
						usedExports: false,
						providedExports: false,
						assets: true,
						chunkOrigins: false,
						builtAt: true,
						timings: true,
						performance: true
					}
				})
			);
		}
	}

	if (!debug) {
		plugins.push(
			new webpack.ids.DeterministicModuleIdsPlugin({
				maxLength: 5
			})
		);
	}

	plugins.push(
		new webpack.IgnorePlugin({
			checkResource(resource: string): boolean {
				if (exclude.length) {
					for (const p of exclude) {
						if (p.length && resource.includes(p)) {
							// eslint-disable-next-line no-console
							console.log('\nExclude:', resource, ' rule: ', p);
							return true;
						}
					}
				}

				return false;
			}
		})
	);

	return plugins;
};
