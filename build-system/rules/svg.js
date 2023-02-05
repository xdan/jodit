/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');

module.exports = ({ superDirname }) => {
	return {
		test: /\.svg$/i,
		use: {
			loader: path.resolve(
				superDirname,
				'./build-system/loaders/svg-loader'
			)
		}
	};
};
