/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');
const { removeAsserts } = require('../utils/remove-asserts');

module.exports = ({ ES, superDirname, isProd, isTest }) => {
	return {
		test: /\.(js|ts)$/,
		loader: 'ts-loader',
		options: {
			transpileOnly: true,
			allowTsInNodeModules: true,
			compilerOptions: {
				target: ES
			},
			getCustomTransformers: () => ({
				before: isProd && !isTest ? [removeAsserts()] : []
			})
		},
		include: [path.resolve(superDirname, './node_modules')]
	};
};
