/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const webpack = require('webpack');

module.exports = ({ banner }) => {
	return new webpack.BannerPlugin({
		banner,
		raw: true,
		entryOnly: true
	});
};
