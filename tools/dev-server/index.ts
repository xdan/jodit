/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';

import * as path from 'path';
import type { Configuration, Middleware } from 'webpack-dev-server';

export const devServer = ({ port, dirname }: Variables): Configuration => ({
	open: '/stand.html',
	allowedHosts: 'all',
	client: {
		progress: true,
		overlay: {
			warnings: false,
			errors: true
		}
	},
	static: [
		{
			directory: path.join(dirname, 'public'),
			serveIndex: true
		},
		{
			directory: path.join(dirname, 'test'),
			publicPath: '/test'
		},
		{
			directory: path.join(dirname, 'build'),
			publicPath: '/build'
		},
		{
			directory: path.join(dirname, 'src'),
			publicPath: '/src'
		},
		{
			directory: path.join(dirname, 'node_modules'),
			publicPath: '/node_modules',
			watch: false
		}
	],
	hot: true,
	host: 'localhost',
	port
});
