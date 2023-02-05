/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const fs = require('fs-extra');
const path = require('path');

const entryFiles = [];

module.exports.includePlugins = dir => {
	const make = require(path.resolve(dir, './make.js'));

	const pluginsEntries = make.paths.reduce((entries, entry) => {
		const fullPath = path.resolve(process.cwd(), entry);
		const name = path.basename(fullPath);
		const rootPath = path.resolve(process.cwd(), './src');
		const entryPath = fullPath.replace(rootPath, '.') + '/' + name;

		let importFile = path.resolve(fullPath, `./${name}.ts`);

		if (!fs.pathExistsSync(importFile)) {
			importFile = path.resolve(fullPath, './index.ts');

			if (!fs.pathExistsSync(importFile)) {
				return entries;
			}
		}

		entryFiles.push(importFile.replace(rootPath, './src'));

		entries[entryPath] = {
			import: importFile.replace(rootPath, './src'),
			dependOn: 'jodit'
		};

		return entries;
	}, {});

	return [pluginsEntries, entryFiles];
};
