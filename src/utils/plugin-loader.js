/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

// const ts = require('typescript');

module.exports = function () {
	this.cacheable && this.cacheable(true);
	return 'module.exports.default = {};';
};

module.exports.seperable = true;
