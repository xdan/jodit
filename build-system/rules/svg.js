/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');

module.exports = ({ dirname }) => {
	return {
		test: /\.svg$/i,
		use: {
			loader: path.resolve(dirname, './build-system/loaders/svg-loader')
		}
	};
};
