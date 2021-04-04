/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
module.exports = function (content) {
	this.cacheable && this.cacheable();
	this.value = content;
	return (
		'module.exports = ' +
		JSON.stringify(
			content
				.replace(/[\n\t]+/g, ' ')
				.replace(/[\s]+/g, ' ')
				.trim()
		)
	);
};

module.exports.seperable = true;
