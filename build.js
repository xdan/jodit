/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */
const webpack = require('webpack');
const path = require('path');
const rootPath = path.resolve(process.cwd()) + path.sep;

const opt = require(path.resolve(rootPath, './webpack.config.js'))([], {
	mode: 'production',
	isTest: false,
	uglify: true,
	es: 'es5'
}, process.cwd(), true);

const compiler = webpack({
	...opt,
	entry: {
		jodit: ['./plugins/show-blocks/show-blocks.ts']
	},
	output: {
		...opt.output,
		filename: 'show-blocks.js'
	}
});
compiler.run();
