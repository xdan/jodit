var webpackConfig = require('./webpack.config');
var path = require('path');

// webpackConfig.entry = 'test/runner.ts';
// webpackConfig.output = {
//     filename: 'dist/bundle.js',
//     libraryTarget: 'umd',
//     library: 'Jodit',
//     umdNamedDefine: true
// };

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
        port: 9876,  // karma web server port
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
               flags: [/*'--no-sandbox', */'--window-size=1920,1000', '--disable-gpu', /*'--headless', */'--disable-extensions', '--disable-translate', /*'--disable-web-security'*/]
            }
        },
        autoWatch: true,
        singleRun: false, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,
        preprocessors: {
            'src/index.ts': ['webpack'],
            // 'test/bootstrap.js': ['webpack'],
            // 'test/tests/*.js': ['webpack'],
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
            resolve: webpackConfig.resolve
        },
        client: {
            // log console output in our test console
            captureConsole: true
        },
        webpackMiddleware: {
            quiet: true,
            stats: {
                // options i.e.
               chunks: false
            },
            noInfo:true,
            // publicPath: webpackConfig.output.publicPath
        }
    })
}