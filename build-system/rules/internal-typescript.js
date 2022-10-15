/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');

module.exports = ({ superDirname, uglify, ES, isProd }) => {
	return {
		test: /\.ts$/,
		use: [
			{
				loader: 'ts-loader',
				options: {
					transpileOnly: isProd,
					allowTsInNodeModules: true,
					compilerOptions: {
						target: ES
					}
				}
			}
		].concat(
			isProd
				? [
						{
							loader: path.resolve(
								__dirname,
								'../loaders/change-asserts.js'
							)
						}
				  ]
				: []
		),
		include: [path.resolve(superDirname, './src/')],
		exclude: [/langs\/[a-z]{2}\.ts/, /langs\/[a-z]{2}_[a-z]{2}\.ts/]
	};
};
