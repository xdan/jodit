/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs-extra';
import * as path from 'path';

type Entries = {
	[key in string]: { import: string; dependOn: string };
};

export const includePlugins = (dir: string): [Entries, string[]] => {
	const entryFiles: string[] = [];
	const make: { paths: string[] } = require(path.resolve(dir, './make.js'));

	const pluginsEntries: Entries = make.paths.reduce(
		(entries, entry) => {
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
		},
		{} as { [key in string]: { import: string; dependOn: 'jodit' } }
	);

	return [pluginsEntries, entryFiles];
};
