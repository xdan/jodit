/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const webpack = require('webpack');

module.exports = vars => {
	const plugins = [new webpack.ProgressPlugin(), require('./define')(vars)];

	const { isProd, ESNext, onlyTS, debug } = vars;

	if (debug) {
		plugins.push(new webpack.HotModuleReplacementPlugin());
	}

	if (isProd) {
		if (!onlyTS) {
			plugins.push(require('./extract-css')(vars));
		}

		plugins.push(require('./banner')(vars));

		if (!ESNext && !onlyTS) {
			plugins.push(require('./post-build')(vars));
		}
	}

	return plugins;
};
