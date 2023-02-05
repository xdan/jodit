/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');
const { removeAsserts } = require('../utils/remove-asserts');

module.exports = ({ superDirname, uglify, ES, isProd, isTest }) => {
	return {
		test: /\.ts$/,
		use: [
			{
				loader: 'ts-loader',
				options: {
					transpileOnly: isProd && !isTest,
					allowTsInNodeModules: true,
					compilerOptions: {
						target: ES
					},
					getCustomTransformers: () => ({
						before: isProd && !isTest ? [removeAsserts()] : []
					})
				}
			}
		],
		include: [path.resolve(superDirname, './src/')],
		exclude: [/langs\/[a-z]{2}\.ts/, /langs\/[a-z]{2}_[a-z]{2}\.ts/]
	};
};
