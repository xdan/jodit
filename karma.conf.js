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
        files: [
            'app.css',
            'test/tests/artio.jpg',
            'dist/jodit.css',
            'dist/jodit.js',
            'test/bootstrap.js',
            'test/tests/*.js'
        ],
        reporters: ['progress'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless'],
        customLaunchers: {
            ChromeHeadless: {
                base: 'Chrome',
               flags: [/*'--no-sandbox', */'--window-size=1920,1000', '--disable-gpu', /*'--headless',*/ '--disable-extensions', '--disable-translate', /*'--disable-web-security'*/]
            }
        },
        autoWatch: true,
        singleRun: false, // Karma captures browsers, runs the tests and exits
        concurrency: Infinity,
        preprocessors: {
            'src/index.ts': ['webpack'],
        },
        plugins: [
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-chai',
            'karma-webpack',
           // 'karma-sourcemap-loader'
        ],
        webpack: {
            devtool: 'eval-source-map',
            module: webpackConfig.module,
            plugins: webpackConfig.plugins,
            resolve: webpackConfig.resolve
        },
        client: {
            // log console output in our test console
            captureConsole: true
        },
        webpackMiddleware: {
           // quiet: true,
            stats: {
                // options i.e.
               // chunks: false
            }
            //noInfo:true,
            // publicPath: webpackConfig.output.publicPath
        }
    })
}