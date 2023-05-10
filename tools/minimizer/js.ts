/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import MinimizeJSPlugin from 'terser-webpack-plugin';
import * as os from 'os';

export default ({ ESNext, isTest, banner }: Variables): MinimizeJSPlugin =>
	new MinimizeJSPlugin({
		parallel: os.cpus().length,
		extractComments: false,

		exclude: './src/langs',

		terserOptions: {
			ecma: ESNext ? 2018 : 5,

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
