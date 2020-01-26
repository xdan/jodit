/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
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

