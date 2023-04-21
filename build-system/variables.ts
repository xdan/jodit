/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as path from 'path';

function Bool(str): boolean {
	return typeof str === 'boolean' ? str : str === 'true';
}

export type Argv = {
	filename?: (name: string) => string;
	env: object;
	mode?: 'production' | 'development';
	isTest?: boolean;
	uglify?: boolean;
	excludeLangs?: boolean;
	stat?: boolean;
	exclude?: string;
	excludePlugins?: string;
	excludeLanguages?: string;
	es?: 'es5' | 'es2015' | 'es2018';
	outputFolder?: string;
	progressFunction?: () => void;
};

export type Variables = {
	argv: { filename?: (name: string) => string };
	exclude: string[];
	superDirname: string;
	outputPath: string;
	banner: string;
	dirname: string;
	pkg: { version: string; homepage: string };
	debug: boolean;
	isTest: boolean;
	onlyTS: boolean;
	isProd: boolean;
	uglify: boolean;
	stat: boolean;
	excludeLangs: boolean;
	excludeLanguages: string[];
	excludePlugins: string[];
	progressFunction:
		| ((percentage: number, msg: string, ...args: string[]) => void)
		| false;
	mode: 'production' | 'development';
	ES: 'es5' | 'es2015' | 'es2018';
	ESNext: boolean;
	port: number;
};

export const variables = (argv: Argv, dir: string): Variables => {
	const pkg = require(path.resolve(dir, './package.json'));

	const banner = `/*!
 * ${pkg.name} - ${pkg.description}
 * Author: ${pkg.author}
 * Version: v${pkg.version}
 * Url: ${pkg.homepage}
 * License(s): ${pkg.license}
 */
	`;

	argv = { ...argv.env, ...argv };

	const debug = !argv || !argv.mode || !argv.mode.match(/production/);

	const isTest = Bool(argv && argv.isTest);

	const mode = debug ? 'development' : argv.mode;
	const isProd = mode === 'production';
	const uglify = Boolean(!debug && argv && Bool(argv.uglify));
	const excludeLangs = Bool(argv.excludeLangs);
	const stat = Bool(argv.stat);
	const exclude = (argv.exclude || '').split(/[,\s;]/);

	const excludePlugins = (argv.excludePlugins || '').split(/[,\s;]/);
	const excludeLanguages = (argv.excludeLanguages || '').split(/[,\s;]/);

	const ES =
		argv && ['es5', 'es2018', 'es2015'].includes(argv.es)
			? argv.es
			: 'es2018';

	const ESNext = ES === 'es2018';
	const dirname = dir;
	const superDirname = path.resolve(__dirname, '..');
	const outputFolder = argv.outputFolder || 'build';
	const outputPath = path.join(dir, outputFolder);

	return {
		port: process.env.WEBPACK_DEV_PORT
			? parseInt(process.env.WEBPACK_DEV_PORT)
			: 2000,
		argv,
		onlyTS: false, // TODO
		exclude,
		superDirname,
		outputPath,
		banner,
		dirname,
		pkg,
		debug,
		isTest,
		isProd,
		uglify,
		stat,
		excludeLangs,
		excludeLanguages,
		excludePlugins,
		progressFunction:
			typeof argv.progressFunction === 'function'
				? argv.progressFunction
				: false,
		mode,
		ES,
		ESNext
	};
};
