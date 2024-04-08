/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import replace from 'replace';

const cwd = path.resolve(process.argv[2]);
if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
	throw new Error('Invalid directory');
}

const packageJson = require(path.resolve(cwd, 'package.json'));

fs.writeFileSync(
	path.join(cwd, 'build/package.json'),
	JSON.stringify(
		{
			...packageJson,
			main: 'esm/index.js',
			module: 'esm/index.js',
			types: 'types/index.d.ts',
			scripts: {},
			dependencies: {
				...packageJson.dependencies,
				...(packageJson.name !== 'jodit'
					? {
							jodit: '^4.0.1'
						}
					: {})
			},
			devDependencies: {}
		},
		null,
		'\t'
	)
);

const copyRecursiveSync = (src: string, dest: string): void => {
	const exists = fs.existsSync(src);
	if (!exists) {
		console.warn(`Path ${src} does not exist'`);
		return;
	}

	const stats = exists && fs.statSync(src);
	const isDirectory = exists && stats && stats.isDirectory();

	if (isDirectory) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}
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
	'config.js',
	'.nvmrc',
	'.npmrc'
].forEach(file => {
	copyRecursiveSync(
		path.resolve(cwd, `./${file}`),
		path.resolve(cwd, `./build/${file}`)
	);
});

replace({
	regex: '../build/',
	replacement: './',
	paths: [path.resolve(cwd, './build/examples')],
	recursive: true,
	silent: false
});
