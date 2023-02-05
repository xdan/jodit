/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const MinimizeJSPlugin = require('terser-webpack-plugin');
const os = require('os');

module.exports = ({ ESNext, isTest, banner }) =>
	new MinimizeJSPlugin({
		parallel: os.cpus().length,
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

				keep_classnames: true,
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
	});
