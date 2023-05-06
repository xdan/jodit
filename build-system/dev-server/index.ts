/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Configuration, Middleware } from 'webpack-dev-server';
import type { Variables } from '../variables';
import * as express from 'express';
import * as path from 'path';

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
			directory: path.join(dirname, 'src'),
			publicPath: '/src'
		},
		{
			directory: path.join(dirname, 'node_modules'),
			publicPath: '/node_modules',
			watch: false
		}
	],
	setupMiddlewares: (middlewares, devServer): Middleware[] => {
		if (!devServer) {
			throw new Error('webpack-dev-server is not defined');
		}

		// devServer.app.get('/test', express.static(dirname + '/test'));

		return middlewares;
	},
	hot: true,
	host: 'localhost',
	port
});
