/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Config } from 'karma';
import * as yargs from 'yargs';
import * as fs from 'fs';
import path from 'path';

const argv = yargs
	.option('grep', {
		type: 'string',
		description: 'Grep test glob pattern'
	})
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
	.option('min', {
		type: 'boolean',
		demandOption: true,
		description: 'Use minified version of js files'
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

if (!fs.existsSync(buildDir + '/jodit' + (argv.min ? '.min' : '') + '.js')) {
	throw new Error('Invalid minified build option');
}

const buildFiles = fs
	.readdirSync(buildDir)
	.filter(file => (argv.min ? /\.min/.test(file) : !/\.min/.test(file)))
	.map(file => buildDir + '/' + file);

console.info('Build directory: ', buildDir);
console.info('Build files: ', buildFiles);

module.exports = function (cnf: Config): void {
	cnf.set({
		basePath: '../',
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
				included: false,
				served: true
			},
			{
				pattern: './test/test.index.html',
				watched: false,
				included: false,
				served: true
			},

			'public/app.css',
			path.resolve(
				argv.cwd,
				'node_modules/synchronous-promise/dist/synchronous-promise.js'
			),

			...buildFiles,
			'test/bootstrap.js',
			{ pattern: argv.grep ?? 'src/**/*.test.js', watched: false },
			{
				pattern: argv.grep ?? 'test/tests/**/*.test.js',
				watched: false
			}
		],

		proxies: {
			'/tests/artio.jpg': '/base/test/tests/artio.jpg',
			'/test.index.html': '/base/test/test.index.html'
		},

		reporters: ['progress'],
		port: 2002,
		hostname: '127.0.0.1',
		colors: true,
		logLevel: cnf.LOG_INFO,
		browsers: ['ChromeHeadless', 'FirefoxHeadless', 'Firefox'],
		customLaunchers: {
			FirefoxHeadless: {
				base: 'Firefox',
				flags: ['-width', '1440', '-height', '900', '-headless']
			},

			ChromeHeadless: {
				base: 'Chrome',
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
