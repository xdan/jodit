const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const pkg = require("./package.json");

const banner = `/*!
 ${pkg.name} - ${pkg.description}
 Author: ${pkg.author}
 Version: v${pkg.version}
 Url: ${pkg.homepage}
 License(s): ${pkg.license}
*/
`;

module.exports = (env, argv) => {

    const debug = !argv || !argv.mode  || !argv.mode.match(/production/);
    const mode = debug ? 'development' : argv.mode;
    const uglify = (!debug && process.env.NODE_ENV !== 'production-no-uflify');

    const css_loaders = [
        debug ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                sourceMap: debug,
                importLoaders: 1,
                minimize: !debug
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: debug,
                plugins: () => {
                    return [
                        require('precss'),
                        require('autoprefixer')
                    ];
                }
            }
        },
        {
            loader: 'less-loader',
            options: {
                sourceMap: debug,
                noIeCompat: true
            }
        },
    ];

    const config = {
        cache: true,
        mode,
        context: __dirname,
        devtool: debug ? "inline-sourcemap" : false,
        entry: debug ? [
            'webpack-hot-middleware/client',
            './src/index'
        ] : './src/index',
        resolve: {
            extensions: [".ts", ".d.ts", ".js", ".json", ".less", '.svg']
        },

        optimization: {
            minimize: !debug && uglify,
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    extractComments: false,
                    uglifyOptions: {
                        ie8: false,
                        mangle: {
                            reserved: ['Jodit'],
                        },
                        compress: {
                            if_return: true,
                            unused: true,
                            booleans: true,
                            properties: true,
                            dead_code: true,
                            warnings: false, // Suppress uglification warnings
                            pure_getters: true,
                            unsafe: true,
                            unsafe_comps: true,
                            drop_console: true,
                            passes: 2
                        },
                        output: {
                            comments: false,
                            beautify: false,
                            preamble: banner,
                        },
                        minimize: true
                    }
                }),
            ],
        },

        output: {
            path: path.join(__dirname, 'build'),
            filename: (uglify || mode === 'development') ? 'jodit.min.js' : 'jodit.js',
            publicPath: '/build/',
            libraryTarget: "umd"
        },


        module: {
            rules: [
                {
                    test: /\.less$/,
                    use: css_loaders
                },
                {
                    test: /\.(ts)$/,
                    use: [
                        {
                            loader: path.resolve('src/utils/lang-loader.js')
                        },
                        'awesome-typescript-loader',
                    ],
                    include: path.resolve('src/langs'),
                    exclude: path.resolve('src/langs/index.ts')
                },
                {
                    test: /\.(ts)$/,
                    loader: 'awesome-typescript-loader',
                    options: uglify ? {
                        //getCustomTransformers: () => privateTransformer
                    } : {},
                    exclude: [
                        /(node_modules|bower_components)/,
                        /langs\/[a-z]{2}\.ts/,
                        /langs\/[a-z]{2}_[a-z]{2}\.ts/,
                    ]
                },
                {
                    test: /\.svg$/i,
                    use: 'raw-loader'
                },
            ]
        },

        plugins: debug ? [
            new webpack.DefinePlugin({
                'appVersion': JSON.stringify(pkg.version),
                'process.env': {
                    'NODE_ENV': JSON.stringify(mode)
                }
            }),
            new webpack.NamedModulesPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ] : [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.DefinePlugin({
                appVersion: JSON.stringify(pkg.version),
                'process.env': {
                    'NODE_ENV': JSON.stringify(mode)
                }
            })
        ]
    };

    if (!debug) {
        switch (mode) {
            case 'production':
                config.plugins.push(
                    new MiniCssExtractPlugin({
                        filename: "jodit.min.css",
                    }),
                );
                break;
        }

        config.plugins.push(
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.min\.css$/,
                cssProcessorOptions: { discardComments: { removeAll: true } }
            }),
            new webpack.BannerPlugin({
                banner,
                raw: true,
                entryOnly: true,
            }),
        );
    }

    return config;
};
