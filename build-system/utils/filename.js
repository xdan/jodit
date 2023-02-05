/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports.fileName = ({ argv, ES, isTest, excludeLangs, uglify }) => {
	if (argv.filename) {
		return argv.filename;
	}

	return name =>
		name +
		(ES === 'es5' || isTest ? '' : '.' + ES) +
		(excludeLangs ? '.en' : '') +
		(uglify ? '.min' : '');
};
