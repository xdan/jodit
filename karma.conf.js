var webpackConfig = require('./webpack.config');

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai'],
        mime: {
            'text/x-typescript': ['ts','tsx'],
            'image/jpeg': ['jpg'],
        },
        files: [
            'app.css',
            'src/index.ts',
            'test/bootstrap.js',
            'test/tests/*.js'
        ],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless', 'IE', 'IE9', 'Firefox'],
        customLaunchers: {
            IE9: {
                base: 'IE',
                'x-ua-compatible': 'IE=EmulateIE9'
            },
            ChromeHeadless: {
                base: 'Chrome',
               flags: [
                   '--window-size=1920,1000',
                   '--disable-gpu',
                   //'--headless', //not work in chrome 60
                   '--disable-extensions',
                   '--disable-translate',
               ]
            }
        },
        autoWatch: true,
        singleRun: false, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,
        preprocessors: {
            'src/index.ts': ['webpack'],
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
        webpack: {
            devtool: 'inline-sourcemap',
            module: webpackConfig.module,
            plugins: webpackConfig.plugins,
            resolve: webpackConfig.resolve,
            output: webpackConfig.output
        },
        client: {
            captureConsole: true
        },
        webpackMiddleware: {
            quiet: true,
            stats: {
               chunks: false
            },
            noInfo:true,
        }
    })
}