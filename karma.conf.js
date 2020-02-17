const webpack = require('./webpack.config');
const webpackConfig = (es = 'es5') =>
	webpack([], {
		mode: 'production',
		isTest: true,
		uglify: true,
		es
	});

module.exports = function(config) {
	config.set({
		basePath: '',
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

			'app.css',
			'src/index.ts',
			'node_modules/synchronous-promise/dist/synchronous-promise.js',
			'test/bootstrap.js',
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
		browsers: ['ChromeHeadless', 'FirefoxHeadless', 'IE', 'IE9', 'Firefox'],
		customLaunchers: {
			IE9: {
				base: 'IE',
				'x-ua-compatible': 'IE=EmulateIE9'
			},

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
			'karma-ie-launcher',
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-mocha',
			'karma-chai',
			'karma-webpack',
			'karma-sourcemap-loader'
		],

		webpack: webpackConfig(),

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
