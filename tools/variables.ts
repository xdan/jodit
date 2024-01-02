/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as path from 'path';

function Bool(str: string | boolean | undefined): boolean {
	return typeof str === 'boolean' ? str : str === 'true';
}

export type ES_TARGET = 'es5' | 'es2015' | 'es2018' | 'es2021';
export type Argv = {
	WEBPACK_SERVE?: boolean;
	filename?: (name: string) => string;
	env: object;
	mode?: 'production' | 'development';
	isTest?: boolean;
	generateTypes?: boolean;
	uglify?: boolean;
	fat?: boolean;
	stat?: boolean;
	exclude?: string;
	excludePlugins?: string;
	includePlugins?: string;
	excludeLanguages?: string;
	includeLanguages?: string;
	es?: ES_TARGET;
	outputFolder?: string;
	progressFunction?: () => void;
};

export type Variables = {
	argv: { filename?: (name: string) => string };
	exclude: string[];
	/**
	 * Path to root Jodit directory
	 */
	superDirname: string;
	outputPath: string;
	banner: string;
	/**
	 * Path to current work directory
	 */
	dirname: string;
	pkg: { version: string; homepage: string };
	debug: boolean;
	serve: boolean;
	isTest: boolean;
	onlyTS: boolean;
	generateTypes: boolean;
	isProd: boolean;
	uglify: boolean;
	stat: boolean;
	excludeLanguages: string[];
	includeLanguages: string[];
	excludePlugins: string[];
	includePlugins: string[];
	progressFunction:
		| ((percentage: number, msg: string, ...args: string[]) => void)
		| false;
	mode: 'production' | 'development';
	ES: ES_TARGET;
	ESNext: boolean;
	ESModern: boolean;
	/**
	 * Compose all plugins in the build
	 */
	fat: boolean;
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

	const mode = (debug ? 'development' : argv.mode) ?? 'production';
	const isProd = mode === 'production';
	const uglify = Boolean(!debug && argv && Bool(argv.uglify));
	const stat = Bool(argv.stat);
	const exclude = (argv.exclude || '').split(/[,\s;]/);

	const excludePlugins = (argv.excludePlugins || '').split(/[,\s;]/);
	const includePlugins = (argv.includePlugins || '').split(/[,\s;]/);
	const excludeLanguages = (argv.excludeLanguages || '').split(/[,\s;]/);
	const includeLanguages = (argv.includeLanguages || '').split(/[,\s;]/);

	const ES = argv.es as ES_TARGET;
	if (!['es5', 'es2018', 'es2021', 'es2015'].includes(ES)) {
		throw Error('Define correct ES target');
	}

	const ESNext = ES === 'es2021';
	const ESModern = ['es2021', 'es2018', 'es2015'].includes(ES);
	const dirname = dir;
	const superDirname = path.resolve(__dirname, '..');
	const outputFolder =
		argv.outputFolder ||
		`build/${ES}${includeLanguages.toString() !== 'en' ? '' : '.en'}/`;
	const outputPath = path.join(dir, outputFolder);

	return {
		port: process.env.WEBPACK_DEV_PORT
			? parseInt(process.env.WEBPACK_DEV_PORT)
			: 2000,
		argv,
		onlyTS: false, // TODO
		exclude,
		generateTypes: Bool(argv.generateTypes),
		fat: Bool(argv.fat),
		serve: Boolean(argv.WEBPACK_SERVE),
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
		excludeLanguages,
		includeLanguages,
		excludePlugins,
		includePlugins,
		progressFunction:
			typeof argv.progressFunction === 'function'
				? argv.progressFunction
				: false,
		mode,
		ES,
		ESModern,
		ESNext
	};
};
