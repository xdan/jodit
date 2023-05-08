/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs';
import * as path from 'path';

const cwd = path.resolve(process.argv[2]);
if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
	throw new Error('Invalid directory');
}

const packageJson = require(path.resolve(cwd, 'package.json'));

fs.writeFileSync(
	path.resolve(cwd, './build/package.json'),
	JSON.stringify(
		{
			...packageJson,
			main: 'es2015/jodit.min.js',
			module: 'esm/index.js',
			types: 'types/index.d.ts',
			scripts: {},
			devDependencies: {}
		},
		null,
		'\t'
	)
);

const copyRecursiveSync = (src: string, dest: string): void => {
	const exists = fs.existsSync(src);
	const stats = exists && fs.statSync(src);
	const isDirectory = exists && stats.isDirectory();
	if (isDirectory) {
		fs.mkdirSync(dest);
		fs.readdirSync(src).forEach((childItemName): void => {
			copyRecursiveSync(
				path.join(src, childItemName),
				path.join(dest, childItemName)
			);
		});
	} else {
		fs.copyFileSync(src, dest);
	}
};

[
	'README.md',
	'CHANGELOG.md',
	'LICENSE.txt',
	'SECURITY.md',
	'examples',
	'.nvmrc',
	'.npmignore'
].forEach(file => {
	copyRecursiveSync(
		path.resolve(cwd, `./${file}`),
		path.resolve(cwd, `./build/${file}`)
	);
});
