/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { LoaderContext } from 'webpack';

import * as ts from 'typescript';
import * as vm from 'vm';

let keys: string[] = [];

export default function (this: LoaderContext<{}>, source: string): string {
	this.cacheable && this.cacheable(true);
	const isEn = this.resourcePath.includes('en.js');
	const isKeys = this.resourcePath.includes('keys.js');

	let result: string[] = [];

	try {
		const transpile = ts.transpileModule(source, {
			compilerOptions: {
				module: ts.ModuleKind.ES2015,
				target: ts.ScriptTarget.ES5
			}
		});

		const content = transpile.outputText;

		const box: { module: { exports: string | string[] } } = {
			module: { exports: '' }
		};

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

		if (isKeys) {
			result = keys; // for Special keys file return keys
		}

		if (isEn) {
			result = lang as string[]; // for Special keys file return keys
		}
	} catch (e) {
		throw new Error('Error in lang-loader: ' + e.message + e.stack);
	}

	return 'module.exports.default = ' + JSON.stringify(result);
}

export const seperable = true;
