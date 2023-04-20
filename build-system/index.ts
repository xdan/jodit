/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
// @ts-check
/** eslint-disable tsdoc/syntax */

import * as path from 'path';

import { type Argv, variables } from './variables';
import { fileName } from './utils/filename';
import { includePlugins } from './utils/include-plugins';
import { WebpackConfiguration } from 'webpack-cli';
/**
 * @param {boolean} onlyTS - build only TypeScript files
 */
export default (
	env: object,
	argv: Argv,
	dir = process.cwd(),
	onlyTS = false
): WebpackConfiguration => {
	const vars = variables(argv, dir);

	const { ES, mode, isTest, isProd, debug, ESNext, uglify, outputPath } =
		vars;

	const [pluginsEntries] = includePlugins(dir);

	console.info(`ES:${ES} Mode:${mode} Test:${isTest} Uglify:${uglify}`);

	return {
		cache: !isProd || {
			type: 'filesystem',
			idleTimeoutForInitialStore: 0,
			name: `jodit${ES}${mode}${uglify}`
		},
		mode,
		target: ['web', 'es5'],
		context: dir,

		stats: {
			colors: true
		},

		devtool: debug ? 'inline-source-map' : false,

		entry: {
			...(!isProd || (!uglify && !ESNext)
				? { vdom: ['./src/core/vdom/index'] }
				: {}),
			jodit: debug
				? ['webpack-hot-middleware/client.js', './src/index']
				: ['./src/index'],
			...pluginsEntries
		},

		output: {
			path: outputPath,
			filename: fileName(vars)('[name]') + '.js',
			publicPath: '/build/',
			libraryTarget: 'umd'
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
				'jodit/src': path.resolve(__dirname, '../src/'),
				jodit: path.resolve(__dirname, '../src/')
			}
		},

		optimization: {
			minimize: !debug && uglify,
			moduleIds: debug ? 'named' : false,
			mangleExports: true,
			minimizer: require('./minimizer').map(mnm =>
				mnm({ isTest, ESNext })
			)
		},

		module: {
			rules: require('./rules/index')(vars)
		},

		plugins: require('./plugins/index')(vars),

		externals: require('./external/index')(vars)
	};
};
