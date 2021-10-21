/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { fileName } = require('../utils/filename');

module.exports = ({ argv, ES, isTest, excludeLangs, uglify }) => {
	return new MiniCssExtractPlugin({
		filename:
			fileName({
				argv,
				ES,
				isTest,
				excludeLangs,
				uglify
			})('[name]') + '.css'
	});
};
