/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
// eslint-disable-next-line strict
const path = require('path');
const fs = require('fs');

const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const MinimizeJSPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
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
	const isTest = Boolean(argv && argv.isTest);

	const mode = debug ? 'development' : argv.mode;
	const isProd = mode === 'production';
	const uglify = !debug && argv && Boolean(argv.uglify);
	const excludeLangs = Boolean(argv.excludeLangs) || false;

	const ES = argv && ['es5', 'es2018'].includes(argv.es) ? argv.es : 'es2018';
	const ESNext = ES === 'es2018';

	console.warn(`ES:${ES} Mode:${mode} Test:${isTest}`);

	const filename =
		argv.filename ||
		(name =>
			name +
			(ES === 'es5' || isTest ? '' : '.' + ES) +
			(excludeLangs ? '.en' : '') +
			(uglify ? '.min' : ''));

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
				sourceMap: debug
			}
		}
	];

	const plugins = [
		new webpack.ProgressPlugin(),
		new webpack.DefinePlugin({
			appVersion: JSON.stringify(pkg.version),
			isProd: isProd,
			isESNext: ESNext,
			isTest: isTest,
			'process.env': {
				TARGET_ES: JSON.stringify(ES),
				NODE_ENV: JSON.stringify(mode),
				EXCLUDE_LANGS: JSON.stringify(excludeLangs)
			}
		})
	];

	const config = {
		cache: !isProd,
		mode,
		context: dir,

		stats: {
			colors: true
		},

		devtool: debug ? 'inline-source-map' : false,

		entry: {
			jodit: debug
				? ['webpack-hot-middleware/client.js', './src/index']
				: ['./src/index']
		},

		output: {
			path: path.join(dir, 'build'),
			filename: filename('[name]') + '.js',
			publicPath: '/build/',
			libraryTarget: 'umd'
		},

		resolve: {
			extensions: ['.js', '.ts', '.d.ts', '.json', '.less', '.svg']
		},

		optimization: {
			minimize: !debug && uglify,
			moduleIds: debug ? 'named' : 'natural',
			minimizer: [
				new MinimizeJSPlugin({
					parallel: true,
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
							passes: 7
						},

						output: {
							comments: false,
							beautify: false,
							preamble: banner
						}
					}
				}),
				new CssMinimizerPlugin({
					parallel: true,
					minimizerOptions: {
						preset: [
							'advanced',
							{
								discardComments: { removeAll: true },
								zindex: false
							}
						]
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
					test: /\.(js|ts)$/,
					loader: 'ts-loader',
					options: {
						transpileOnly: true,
						allowTsInNodeModules: true
					},
					include: [path.resolve(__dirname, './node_modules')]
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
					include: [path.resolve(__dirname, './src/')],
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
			? [...plugins, new webpack.HotModuleReplacementPlugin()]
			: plugins
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
						require('autoprefixer')({
							overrideBrowserslist: [
								'>1%',
								'last 4 versions',
								'Firefox ESR',
								'ie >= 11'
							]
						}),
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
								fs.writeFile(
									file,
									banner + result.css,
									() => true
								);
							});
					});
				})
			);
		}
	}

	Object.defineProperty(config, 'css_loaders', {
		enumerable: false,
		value: css_loaders
	});

	return config;
};
