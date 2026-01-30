/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import 'dotenv/config';

import { externals } from './external/index';
import { plugins } from './plugins/index';
import { rules } from './rules/index';
import { fileName } from './utils/filename';
import { includePlugins } from './utils/include-plugins';
import { devServer } from './dev-server';
import { minimizer } from './minimizer';
import { type Argv, variables } from './variables';

import * as path from 'path';
import type { Configuration } from 'webpack';

export default (
	env: object,
	argv: Argv,
	dir = process.cwd(),
	onlyTS = false
): Configuration => {
	argv = { ...argv.env, ...argv };

	const vars = variables(argv, dir);

	const {
		ES,
		superDirname,
		dirname,
		mode,
		isTest,
		isProd,
		debug,
		fat,
		uglify,
		outputPath,
		stat
	} = vars;

	const [pluginsEntries] = includePlugins(dir);

	console.info(
		`ES:${ES} Mode:${mode} Test:${isTest} Uglify:${uglify} Fat:${fat} GenerateTypes:${vars.generateTypes} SWC:${vars.useSWC} Stat:${stat}`
	);

	return {
		cache: !isProd || {
			type: 'filesystem',
			idleTimeoutForInitialStore: 0,
			name: `jodit${ES}${mode}${uglify}${fat}`
		},
		mode,
		target: ['web', 'es5'],
		context: dir,

		stats: stat
			? {
					colors: true
				}
			: 'errors-only',

		devtool: debug ? 'inline-source-map' : false,

		entry: {
			jodit: ['./src/index.ts'],
			...(!fat ? pluginsEntries : {}),
			...(ES === 'es5' ? { polyfills: ['./src/polyfills.ts'] } : {})
		},

		output: {
			path: outputPath,
			filename: fileName(vars)('[name]') + '.js',
			publicPath: '/build/',
			libraryTarget: 'umd'
		},

		snapshot: {
			managedPaths: []
		},

		watchOptions: {
			followSymlinks: true
		},

		resolve: {
			extensions: [
				'.js',
				'.ts',
				'.d.ts',
				'.json',
				'.less',
				'.css',
				'.svg'
			],
			alias: {
				[superDirname === dirname ? 'jodit' : 'jodit-pro']:
					path.resolve(dirname, './src/'),
				super: path.resolve(superDirname, './src/')
			},
			symlinks: false
		},

		optimization: {
			minimize: !debug && uglify,
			moduleIds: debug ? 'named' : false,
			concatenateModules: false,
			mangleExports: false,
			minimizer: minimizer.map(mnm => mnm(vars))
		},

		performance: {
			hints: false
		},

		module: {
			rules: rules(vars)
		},

		plugins: plugins(vars),

		externals: externals(vars),

		devServer: devServer(vars)
	};
};
