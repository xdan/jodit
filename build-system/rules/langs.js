/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');

module.exports = ({ superDirname }) => {
	return {
		test: /\.(js)$/,
		use: [
			{
				loader: path.resolve(__dirname, '../loaders/lang-loader.js')
			}
		],
		include: path.resolve(superDirname, './src/langs'),
		exclude: path.resolve(superDirname, './src/langs/index.ts')
	};
};
