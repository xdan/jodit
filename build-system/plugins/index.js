/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const webpack = require('webpack');

module.exports = vars => {
	const { isProd, isTest, ESNext, onlyTS, debug, exclude, progressFunction } =
		vars;

	const plugins = [require('./define')(vars)];

	plugins.push(
		new webpack.ProgressPlugin(
			progressFunction ? progressFunction : undefined
		)
	);

	if (debug) {
		plugins.push(new webpack.HotModuleReplacementPlugin());
	}

	if (isProd) {
		if (!onlyTS) {
			plugins.push(require('./extract-css')(vars));
		}

		plugins.push(require('./banner')(vars));

		if (!isTest && !ESNext && !onlyTS) {
			plugins.push(require('./post-build')(vars));
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
			checkResource(resource) {
				if (exclude.length) {
					for (const p of exclude) {
						if (p.length && resource.includes(p)) {
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
