/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const ts = require("typescript");
const vm = require("vm");

let keys = [];

module.exports = function (source) {
	this.cacheable && this.cacheable(true);

	let result = [];

	try {
		const transpile = ts.transpileModule(source, { compilerOptions: {
				module: ts.ModuleKind.ES2015
		}});

		const es5export = 'result = ';
		const content = transpile.outputText
			.replace('export default', es5export)
			.replace('exports.default =', es5export);

		const box = {};

		vm.runInNewContext(content, box);

		const lang = box.result;

		if (!keys.length) {
			keys = Object.keys(lang);
		}

		keys.forEach((key, index) => {
			result[index] = lang[key];
		});

		if (this.resourcePath.indexOf('en.ts') !== -1) {
			result = keys; // for English file return keys
		}

	} catch (e) {
		throw new Error('Error in lang-loader: ' + e.message);
	}

	return 'module.exports.default = ' + JSON.stringify(result);
};

module.exports.seperable = true;

