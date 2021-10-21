/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const ts = require('typescript');
const vm = require('vm');

let keys = [];

module.exports = function (source) {
	this.cacheable && this.cacheable(true);

	let result = [];

	try {
		const transpile = ts.transpileModule(source, {
			compilerOptions: {
				module: ts.ModuleKind.es5
			}
		});

		const es5export = 'result = ';
		const content = transpile.outputText
			.replace('export default', es5export)
			.replace('exports.default =', es5export);

		const box = {};

		try {
			vm.runInNewContext(content, box);
		} catch (e) {
			vm.runInNewContext('var exports={};' + content, box);
		}

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
