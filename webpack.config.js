const path = require('path');

const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MinimizeJSPlugin = require('terser-webpack-plugin');

const pkg = require('./package.json');

const banner = `/*!
 ${pkg.name} - ${pkg.description}
 Author: ${pkg.author}
 Version: v${pkg.version}
 Url: ${pkg.homepage}
 License(s): ${pkg.license}
*/
`;

module.exports = (env, argv) => {
	const debug = !argv || !argv.mode || !argv.mode.match(/production/);
	const isTest = argv && Boolean(argv.isTest);

	const mode = debug ? 'development' : argv.mode;
	const isProd = mode === 'production';
	const uglify = !debug && (argv && Boolean(argv.uglify));


	const ES = (argv && ['es5', 'es2018'].includes(argv.es)) ? argv.es: 'es2018';
	const ESNext = ES === 'es2018';

	console.warn('ES mode: ' + ES);

	const filename = (name) => name + ((ES === 'es5' || isTest) ? '' : '.' + ES) + (uglify ? '.min' : '');

	const css_loaders = [
		(debug || isTest) ? 'style-loader' : MiniCssExtractPlugin.loader,
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
				plugins: () => [require('precss'), require('autoprefixer')]
			}
		},
		{
			loader: 'less-loader',
			options: {
				sourceMap: debug,
				noIeCompat: true
			}
		}
	];

	const config = {
		cache: !isProd,
		mode,
		context: __dirname,

		devtool: debug ? 'inline-sourcemap' : false,

		entry: {
			jodit: debug ? ['webpack-hot-middleware/client', './src/index'] : ['./src/index']
		},

		output:  {
			path: path.join(__dirname, 'build'),
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

					exclude: "./src/langs",
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
							passes: 3
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
					use: css_loaders,
					include: path.resolve('./src')
				},

				{
					test: /\.(ts)$/,
					use: [
						{
							loader: path.resolve('./src/utils/lang-loader.js')
						}
					],
					include: path.resolve('./src/langs'),
					exclude: path.resolve('./src/langs/index.ts')
				},

				{
					test: /\.ts$/,
					loader: 'ts-loader',
					options: {
						transpileOnly: uglify,
						compilerOptions: {
							target: ES
						}
					},
					include: path.resolve('src/'),
					exclude: [
						/(node_modules)/,
						/langs\/[a-z]{2}\.ts/,
						/langs\/[a-z]{2}_[a-z]{2}\.ts/,
					]
				},

				{
					test: /\.svg$/i,
					use: {
						loader: path.resolve('src/utils/svg-loader.js')
					}
				}
			]
		},

		plugins: debug
			? [
					new webpack.DefinePlugin({
						appVersion: JSON.stringify(pkg.version),
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
	}

	return config;
};
