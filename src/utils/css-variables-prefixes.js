/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = function (source) {
	this.cacheable && this.cacheable(true);
	return source.replace(/--([a-z0-9_-]+)/g, '--jd-$1');
};

module.exports.seperable = true;
