/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');

module.exports = variables => {
	return [
		require('./css')(variables),
		require('./extra-typescript')(variables),
		require('./langs')(variables),
		require('./internal-typescript')(variables),
		require('./svg')(variables)
	];
};
