/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs';
import type { Config } from 'karma';
import path from 'path';
import * as yargs from 'yargs';

const argv = yargs
	.option('cwd', {
		type: 'string',
		demandOption: true,
		description: 'Work directory'
	})
	.option('build', {
		type: 'string',
		demandOption: true,
		description: 'Build directory(es5, es2018 etc)'
	})
	.option('fat', {
		type: 'boolean',
		demandOption: true,
		description: 'Use a fat version of js files'
	})
	.option('min', {
		type: 'boolean',
		demandOption: true,
		description: 'Use a minified version of js files'
	})
	.parseSync();

if (argv.grep) {
	console.info('Grep glob pattern: ', argv.grep);
}

const buildDir = './build/' + argv.build;

const workDirectory = path.resolve(argv.cwd, buildDir);

if (
	!fs.existsSync(workDirectory) ||
	!fs.statSync(workDirectory).isDirectory()
) {
	throw new Error('Invalid build directory:' + workDirectory);
}

if (
	!fs.existsSync(
		buildDir +
			'/jodit' +
			(argv.fat ? '.fat' : '') +
			(argv.min ? '.min' : '') +
			'.js'
	)
) {
	throw new Error('Invalid minified build option');
}

function findFiles(dir: string): string[] {
	return fs
		.readdirSync(dir, { withFileTypes: true })
		.map(f =>
			f.isDirectory()
				? findFiles(path.resolve(dir, f.name))
				: path.resolve(dir, f.name)
		)
		.flat()
		.filter(file => (argv.fat ? /\.fat/.test(file) : !/\.fat/.test(file)))
		.filter(file => (argv.min ? /\.min/.test(file) : !/\.min/.test(file)));
}

const buildFiles = findFiles(buildDir);

console.info('Build directory: ', buildDir);
console.info('Build files: ', buildFiles);

module.exports = function (cnf: Config): void {
	cnf.set({
		basePath: argv.cwd,
		frameworks: ['mocha', 'chai'],

		mime: {
			'text/css': ['css'],
			'text/x-typescript': ['ts', 'tsx'],
			'image/jpeg': ['jpg']
		},

		files: [
			{
				pattern: './test/tests/artio.jpg',
				watched: false,
				included: false
			},
			{
				pattern: './test/test.index.html',
				watched: false,
				included: false
			},

			'./public/app.css',
			'./test/tests/browser-module.js',
			'./node_modules/synchronous-promise/index.js',

			...buildFiles,

			...Array.from(
				new Set([
					path.resolve(__dirname, '../test/bootstrap.js'),
					path.resolve(argv.cwd, 'test/bootstrap.js'),
					path.resolve(__dirname, '../src/**/*.test.js'),
					path.resolve(argv.cwd, './src/**/*.test.js'),
					path.resolve(__dirname, '../test/tests/**/*.test.js'),
					path.resolve(argv.cwd, 'test/tests/**/*.test.js')
				])
			)
		],

		proxies: {
			'/app.css': '/base/public/app.css',
			'/public/app.css': '/base/public/app.css',
			'/tests/artio.jpg': '/base/test/tests/artio.jpg',
			'/test.index.html': '/base/test/test.index.html'
		},

		reporters: ['progress'],
		port: 2002,
		hostname: '127.0.0.1',
		colors: true,
		logLevel: cnf.LOG_INFO,
		browsers: [
			'chrome_debug',
			'chrome_headless',
			'FirefoxHeadless',
			'Firefox'
		],
		customLaunchers: {
			FirefoxHeadless: {
				base: 'Firefox',
				flags: ['-width', '1440', '-height', '900', '-headless']
			},

			chrome_debug: {
				base: 'Chrome',
				flags: [
					'--window-size=1440,900',
					'--disable-gpu',
					'--disable-extensions',
					'--disable-translate'
				]
			},

			chrome_headless: {
				base: 'ChromeHeadless',
				flags: [
					'--window-size=1440,900',
					'--disable-gpu',
					'--disable-extensions',
					'--disable-translate'
				]
			}
		},

		autoWatch: true,
		singleRun: true, // Karma captures browsers, runs the tests and exits
		concurrency: Infinity,

		plugins: [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-mocha',
			'karma-chai',
			'karma-sourcemap-loader'
		],

		client: {
			captureConsole: true
		}
	});
};
