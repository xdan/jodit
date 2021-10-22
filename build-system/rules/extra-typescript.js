/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');

module.exports = ({ dirname, ES }) => {
	return {
		test: /\.(js|ts)$/,
		loader: 'ts-loader',
		options: {
			transpileOnly: true,
			allowTsInNodeModules: true,
			compilerOptions: {
				target: ES
			}
		},
		include: [path.resolve(dirname, './node_modules')]
	};
};
