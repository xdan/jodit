/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const MinimizeJSPlugin = require('terser-webpack-plugin');

module.exports = ({ ESNext, isTest, banner }) =>
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

				pure_funcs: ['assert'],

				passes: 7
			},

			output: {
				comments: false,
				beautify: false,
				preamble: banner
			}
		}
	});
