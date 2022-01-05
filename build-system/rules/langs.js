/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');

module.exports = ({ superDirname }) => {
	return {
		test: /\.(ts)$/,
		use: [
			{
				loader: path.resolve(__dirname, '../loaders/lang-loader')
			}
		],
		include: path.resolve(superDirname, './src/langs'),
		exclude: path.resolve(superDirname, './src/langs/index.ts')
	};
};
