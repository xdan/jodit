const path = require('path');
const debug = !process.env.NODE_ENV  || !process.env.NODE_ENV.match(/production/);
const production = debug ? 'none' : process.env.NODE_ENV;


const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const pkg = require("./package.json");

process.deprecated = false;
process.traceDeprecation = true;


const banner = `
   ${pkg.name} - ${pkg.description}
   Author: ${pkg.author}
   Version: v${pkg.version}
   Url: ${pkg.homepage}
   License(s): ${pkg.license}
`;

const loaders = [
    {
        loader: 'css-loader',
        options: {
            sourceMap: true,
            importLoaders: 1,
            minimize: !debug
        }
    },
    {
        loader: 'clean-css-loader'
    },
    {
        loader: 'postcss-loader',
        options: {
            sourceMap: true,
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
            sourceMap: true,
            noIeCompat: true
        }
    },
];

if (debug) {
    loaders.splice(1, 1);
}

module.exports = {
    cache: true,
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : false,
    entry: debug ? [
        'webpack-hot-middleware/client',
        './src/index'
    ] : './src/index',

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".less"]
    },

    output: {
        path: path.join(__dirname, 'build'),
        filename: production  !== 'production-no-uflify' ? 'jodit.min.js' : 'jodit.js',
        publicPath: '/build/',
        libraryTarget: "umd",
        // name of the global var: "Jodit"
        library: "Jodit"
    },


    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: loaders
                })
            },
            {
                test: /\.(ts)$/,
                loader: 'awesome-typescript-loader',
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.(svg)$/i,
                include: [
                    path.resolve(__dirname, "src/styles/icons"),
                    path.resolve(__dirname, "src/styles/widgets"),
                ],
                use: [
                    {
                        loader: 'svg-inline-loader',
                        options: {
                            removeTags: ['?xml', 'title', 'desc', 'defs', 'style'],
                            removingTagAttrs: ['id', 'version', 'xmlns', 'xmlns:xlink', 'width', 'height'],
                            removeSVGTagAttrs: ['id', 'version', 'xmlns', 'xmlns:xlink', 'width', 'height'],
                            name: '[path][name].[ext]',
                            limit: 4096
                        }
                    }
                ]
            },
        ]
    },

    plugins: debug ? [
        new webpack.DefinePlugin({
            'appVersion': JSON.stringify(pkg.version),
            'process.env': {
                'NODE_ENV': '"developer"'
            }
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ] : [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            appVersion: JSON.stringify(pkg.version),
            'process.env': {
                'NODE_ENV': '"production"'
            }
        })
    ],
    node: {
        global: true,
        crypto: 'empty',
        process: false,
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
};

module.exports.plugins.push(new ExtractTextPlugin({
    disable: debug,
    filename: 'jodit.min.css',
    allChunks: true
}));

if (!debug) {
    switch (production) {
        case 'production':
            module.exports.plugins.push(
                new webpack.optimize.UglifyJsPlugin({
                    ie8: false,
                    mangle: { reserved: ['Jodit'] },
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
                        screw_ie8: true,
                        drop_console: true,
                        passes: 2
                    },
                    output: {
                        comments: false,
                        beautify: false,
                    },
                    minimize: true
                })
            );
            break;
    }

    module.exports.plugins.push(
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.min\.css$/,
            cssProcessorOptions: { discardComments: { removeAll: true } }
        }),
        new webpack.BannerPlugin(banner),
    );
}