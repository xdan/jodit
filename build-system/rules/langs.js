/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');

module.exports = ({ dirname }) => {
	return {
		test: /\.(ts)$/,
		use: [
			{
				loader: path.resolve('../loaders/lang-loader')
			}
		],
		include: path.resolve(dirname, './src/langs'),
		exclude: path.resolve(dirname, './src/langs/index.ts')
	};
};
