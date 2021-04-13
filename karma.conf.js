/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');
const webpackConfFunc = require(path.resolve(
	process.cwd(),
	'./webpack.config'
));

const webpackConfig = (() => {
	const config = webpackConfFunc(
		[],
		{
			mode: 'production',
			isTest: true,
			uglify: true,
			es: 'es5'
		},
		process.cwd()
	);

	delete config.context;
	// delete config.entry;

	delete config.output.path;
	delete config.output.filename;
	delete config.output.publicPath;
	// delete config.output;

	config.stats = {
		modules: false,
		colors: true
	};

	config.watch = false;

	config.optimization = {
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			minSize: 0,
			cacheGroups: {
				commons: {
					name: 'commons',
					chunks: 'initial',
					minChunks: 1
				}
			}
		}
	};

	return config;
})();

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['mocha', 'chai', 'webpack'],

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

			'app.css',
			'build/jodit.js',
			'build/jodit.css',
			'node_modules/synchronous-promise/dist/synchronous-promise.js',
			'test/bootstrap.js',
			'config.js',
			'src/**/*.test.js',
			'test/tests/units/*.js',
			'test/tests/acceptance/*.js',
			'test/tests/acceptance/plugins/*.js'
		],

		proxies: {
			'/tests/artio.jpg': '/base/test/tests/artio.jpg',
			'/test.index.html': '/base/test/test.index.html'
		},

		reporters: ['progress'],
		port: 2002,
		hostname: '127.0.0.1',
		colors: true,
		logLevel: config.LOG_INFO,
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

		preprocessors: {
			'src/index.ts': ['webpack']
		},

		plugins: [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-webpack',
			'karma-mocha',
			'karma-chai',
			'karma-sourcemap-loader'
		],

		webpack: webpackConfig,

		client: {
			captureConsole: true,
			mocha: {
				bail: true
			}
		},

		webpackMiddleware: {
			quiet: true,
			stats: {
				chunks: false
			},
			noInfo: true
		}
	});
};
