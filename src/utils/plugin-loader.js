/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const ts = require("typescript");

module.exports = function (source) {
	this.cacheable && this.cacheable(true);

	// let result = [];
	//
	// try {
	// 	const transpile = ts.transpileModule(source, {compilerOptions: {
	// 			module: ts.ModuleKind.ES2015
	// 	}});
	//
	// 	const es5export = 'result = ';
	// 	const content = transpile.outputText;
	//
	// } catch (e) {
	// 	throw new Error('Error in lang-loader: ' + e.message);
	// }

	return 'module.exports.default = {};';
};

module.exports.seperable = true;

