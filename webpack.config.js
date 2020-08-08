/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const path = require('path');
const fs = require('fs');

const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinimizeJSPlugin = require('terser-webpack-plugin');
const PostBuild = require('./src/utils/post-build');

/**
 * @param {array} end
 * @param {object} argv
 * @param {string} dir
 */
module.exports = (env, argv, dir = __dirname, onlyTS = false) => {
	const pkg = require(path.resolve(dir, './package.json'));

	const banner = `/*!
 * ${pkg.name} - ${pkg.description}
 * Author: ${pkg.author}
 * Version: v${pkg.version}
 * Url: ${pkg.homepage}
 * License(s): ${pkg.license}
 */
	`;

	const debug = !argv || !argv.mode || !argv.mode.match(/production/);
	const isTest = argv && Boolean(argv.isTest);

	const mode = debug ? 'development' : argv.mode;
	const isProd = mode === 'production';
	const uglify = !debug && argv && Boolean(argv.uglify);

	const ES = argv && ['es5', 'es2018'].includes(argv.es) ? argv.es : 'es2018';
	const ESNext = ES === 'es2018';

	console.warn('ES mode: ' + ES);

	const filename = name =>
		name +
		(ES === 'es5' || isTest ? '' : '.' + ES) +
		(uglify ? '.min' : '');

	const css_loaders = [
		debug || isTest ? 'style-loader' : MiniCssExtractPlugin.loader,
		{
			loader: 'css-loader',
			options: {
				sourceMap: debug,
				importLoaders: 1
			}
		},
		{
			loader: path.resolve(
				__dirname,
				'./src/utils/css-variables-prefixes'
			)
		},
		{
			loader: 'less-loader',
			options: {
				sourceMap: debug,
				lessOptions: {}
			}
		}
	];

	const config = {
		cache: !isProd,
		mode,
		context: dir,

		devtool: debug ? 'inline-sourcemap' : false,

		entry: {
			jodit: ['./src/index']
		},

		output: {
			path: path.join(dir, 'build'),
			filename: filename('[name]') + '.js',
			publicPath: '/build/',
			libraryTarget: 'umd'
		},

		resolve: {
			extensions: ['.ts', '.d.ts', '.js', '.json', '.less', '.svg']
		},

		optimization: {
			minimize: !debug && uglify,

			minimizer: [
				new MinimizeJSPlugin({
					parallel: true,
					sourceMap: false,
					extractComments: false,

					exclude: './src/langs',
					terserOptions: {
						ecma: ESNext ? 8 : 5,

						mangle: {
							reserved: ['Jodit']
						},

						compress: {
							unsafe_arrows: ESNext,
							unsafe_methods: ESNext,
							unsafe: ESNext,

							drop_console: !isTest,
							drop_debugger: !isTest,

							pure_getters: true,
							unsafe_comps: true,
							passes: 5
						},

						output: {
							comments: false,
							beautify: false,
							preamble: banner
						}
					}
				})
			]
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
							loader: path.resolve(
								__dirname,
								'./src/utils/lang-loader.js'
							)
						}
					],
					include: path.resolve(__dirname, './src/langs'),
					exclude: path.resolve(__dirname, './src/langs/index.ts')
				},

				{
					test: /\.ts$/,
					loader: 'ts-loader',
					options: {
						transpileOnly: uglify,
						allowTsInNodeModules: true,
						compilerOptions: {
							target: ES
						}
					},
					include: path.resolve(__dirname, './src/'),
					exclude: [
						/langs\/[a-z]{2}\.ts/,
						/langs\/[a-z]{2}_[a-z]{2}\.ts/
					]
				},

				{
					test: /\.svg$/i,
					use: {
						loader: path.resolve(
							__dirname,
							'src/utils/svg-loader.js'
						)
					}
				}
			]
		},

		plugins: debug
			? [
					new webpack.DefinePlugin({
						appVersion: JSON.stringify(pkg.version),
						isProd: isProd,
						'process.env': {
							TARGET_ES: JSON.stringify(ES),
							NODE_ENV: JSON.stringify(mode)
						}
					}),
					new webpack.NamedModulesPlugin(),
					new webpack.HotModuleReplacementPlugin()
				]
			: [
					new webpack.optimize.OccurrenceOrderPlugin(),
					new webpack.DefinePlugin({
						appVersion: JSON.stringify(pkg.version),
						isProd: isProd,
						'process.env': {
							TARGET_ES: JSON.stringify(ES),
							NODE_ENV: JSON.stringify(mode)
						}
					})
				]
	};

	if (!debug && !isTest) {
		switch (mode) {
			case 'production':
				config.plugins.push(
					new MiniCssExtractPlugin({
						filename: filename('[name]') + '.css'
					})
				);

				break;
		}

		config.plugins.push(
			new OptimizeCssAssetsPlugin({
				assetNameRegExp: /\.css$/,
				cssProcessorPluginOptions: {
					preset: [
						'default',
						{
							discardComments: {
								removeAll: true
							},
							normalizeWhitespace: uglify
						}
					]
				}
			}),

			new webpack.BannerPlugin({
				banner,
				raw: true,
				entryOnly: true
			})
		);

		if (isProd && !ESNext && !onlyTS) {
			config.plugins.push(
				new PostBuild(() => {
					const postcss = require('postcss');
					const plugins = postcss([
						require('autoprefixer'),
						require('postcss-css-variables')
					]);

					const file = path.resolve(
						config.output.path,
 						filename('jodit') + '.css'
					);

					fs.readFile(file, (err, css) => {
						if (err) {
							console.log(err);
							return;
						}

						plugins
							.process(css, { from: file, to: file })
							.then(result => {
								fs.writeFile(file, result.css, () => true);
							});
					});
				})
			);
		}
	}

	Object.defineProperty(config, 'css_loaders', {
		enumerable: false,
		value: css_loaders
	})

	return config;
};
