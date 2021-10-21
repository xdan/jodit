/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const webpack = require('webpack');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const rootPath = path.resolve(process.cwd()) + path.sep;
const config = require(path.resolve(rootPath, './webpack.config.js'));

const argv = yargs(hideBin(process.argv)).option('uglify', {
	type: 'boolean'
}).argv;

const opt = config(
	[],
	{
		mode: 'production',
		uglify: true,
		es: 'es5',
		...argv
	},
	rootPath
);

module.exports = new Promise((resolve, reject) => {
	webpack(opt, (err, stats) => {
		if (err) {
			console.log(err);
			reject(err);
		} else {
			console.log(stats.toString({ colors: true }));
			resolve(stats.toString({ colors: true }));
		}
	});
});
