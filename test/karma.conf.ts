/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as yargs from 'yargs';
import type { config } from 'karma';

const { argv } = yargs.option('grep', {
	type: 'string',
	description: 'Grep test gllob pattern'
});

if (argv.grep) {
	console.info('Grep glob pattern: ', argv.grep);
}

module.exports = function (cnf: config): void {
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
			'node_modules/synchronous-promise/dist/synchronous-promise.js',
			'build/jodit.js',
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
				flags: ['-width', 1440, '-height', 900, '-headless']
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
			captureConsole: true,
			mocha: {
				bail: true
			}
		}
	});
};
