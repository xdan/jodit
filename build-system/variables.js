/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');

module.exports.variables = (argv, dir) => {
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
	const dirname = dir;
	const outputPath = path.join(dir, 'build');

	return {
		argv,
		outputPath,
		banner,
		dirname,
		pkg,
		debug,
		isTest,
		isProd,
		uglify,
		excludeLangs,
		mode,
		ES,
		ESNext
	};
};
