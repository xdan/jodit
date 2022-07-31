/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const ts = require('typescript');
const vm = require('vm');

let keys = [];

module.exports = function (source) {
	this.cacheable && this.cacheable(true);
	const isEn = this.resourcePath.includes('en.js');

	let result = [];

	try {
		const transpile = ts.transpileModule(source, {
			compilerOptions: {
				module: 'es5',
				target: 'es5'
			}
		});

		const content = transpile.outputText;

		const box = {};

		try {
			vm.runInNewContext('var module={};' + content, box);
		} catch {}

		const lang = box.module.exports;

		if (!keys.length && lang) {
			keys = Object.keys(lang);
		}

		keys.forEach((key, index) => {
			result[index] = lang[key];
		});

		if (isEn) {
			result = keys; // for English file return keys
		}
	} catch (e) {
		throw new Error('Error in lang-loader: ' + e.message + e.stack);
	}

	return 'module.exports.default = ' + JSON.stringify(result);
};

module.exports.seperable = true;
