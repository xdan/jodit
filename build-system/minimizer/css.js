/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = () =>
	new CssMinimizerPlugin({
		parallel: true,
		minimizerOptions: {
			preset: [
				'advanced',
				{
					discardComments: { removeAll: true },
					zindex: false
				}
			]
		}
	});
