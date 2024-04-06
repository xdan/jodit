/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import * as vm from 'vm';
import type { LoaderContext } from 'webpack';

let keys: string[] = [];
type Lang = { [key in string]: string };

export default function (this: LoaderContext<{}>, source: string): string {
	this.cacheable && this.cacheable(true);

	const isEn = this.resourcePath.includes('en.js');
	const isKeys = this.resourcePath.includes('keys.js');
	const directory = path.dirname(this.resourcePath);

	let result: string[] | Lang = [];

	const lang = loadLangObject(source);

	if (!keys.length && lang) {
		keys = Object.keys(
			loadLangObject(
				fs.readFileSync(path.resolve(directory, 'ar.js'), 'utf-8')
			)
		);
	}

	if (isKeys) {
		result = keys; // for Special keys file return keys
	} else if (isEn) {
		result = lang;
	} else {
		keys.forEach((key, index) => {
			(result as string[])[index] = lang[key];
		});
	}

	return 'module.exports.default = ' + JSON.stringify(result);
}

export const seperable = true;

function loadLangObject(source: string): Lang {
	const transpile = ts.transpileModule(source, {
		compilerOptions: {
			module: ts.ModuleKind.ES2015,
			target: ts.ScriptTarget.ES5
		}
	});

	const content = transpile.outputText;

	const box: { module: { exports: Lang } } = {
		module: { exports: {} }
	};

	try {
		vm.runInNewContext('var module={};' + content, box);
	} catch {}

	return box.module.exports;
}
