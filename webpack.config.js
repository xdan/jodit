const path = require('path');
const debug = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

process.deprecated = false

let less_loaders = [
    // activate source maps via loader query
    {
        loader: 'css-loader',
        options: {
            sourceMap: true,
            importLoaders: 1
        }
    },
    {
        loader: 'clean-css-loader'
    },
    {
        loader: 'postcss-loader',
        options: {
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
            sourceMap: true
        }
    },
];

if (debug) {
    less_loaders.splice(1, 1);
}

module.exports = {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : false,
    entry: debug ? [
        'webpack-hot-middleware/client',
        './src/index'
    ] : './src/index',

    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'jodit.js',
        publicPath: '/dist/',
        libraryTarget: "this",
        // name of the global var: "Foo"
        library: "Jodit"
    },

    module: {
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: less_loaders
                })
            },
            {
                //include: path.resolve(__dirname, "src"),
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.js$/,
                loader: 'eslint-loader',
                include: [
                    path.resolve(__dirname, "src"),
                ],
            },
            {
                test: /\.(svg)$/i,
                include: [
                    path.resolve(__dirname, "src/styles/icons"),
                ],
                use: [
                    {
                        loader: 'svg-inline-loader',
                        options: {
                            name: '[path][name].[ext]',
                            limit: 4096
                        }
                    }
                ]
            },
        ]
    },

    plugins: debug ? [
        new webpack.HotModuleReplacementPlugin()
    ] : [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false, // Suppress uglification warnings
                pure_getters: true,
                unsafe: true,
                unsafe_comps: true,
                screw_ie8: true
            },
            output: {
                comments: false,
            },
            minimize: true
        }),
    ],
}
module.exports.plugins.push(new ExtractTextPlugin({
    disable: debug,
    filename: 'jodit.css',
    // path: path.join(__dirname, 'dist'),
    allChunks: true
}));