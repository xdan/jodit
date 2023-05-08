/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs';
import * as path from 'path';

const packageJson = require('../../package.json');

fs.writeFileSync(
	'./build/package.json',
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
	copyRecursiveSync(`./${file}`, `./build/${file}`);
});
