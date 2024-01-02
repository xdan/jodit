/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

export default (): CssMinimizerPlugin =>
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
