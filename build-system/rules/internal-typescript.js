/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');

module.exports = ({ superDirname, uglify, ES }) => {
	return {
		test: /\.ts$/,
		loader: 'ts-loader',
		options: {
			transpileOnly: uglify,
			allowTsInNodeModules: true,
			compilerOptions: {
				target: ES
			}
		},
		include: [path.resolve(superDirname, './src/')],
		exclude: [/langs\/[a-z]{2}\.ts/, /langs\/[a-z]{2}_[a-z]{2}\.ts/]
	};
};
