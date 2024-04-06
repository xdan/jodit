/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

const dir = path.resolve(process.cwd()) + '/';
console.log('Find directory:', dir);

const list = [];
// options is optional
const srcFiles = glob.sync(dir + '?(src|test)/**/*.test.js');
list.push(
	...srcFiles.map((p: string): string =>
		p.replace(dir + 'src/', '../src/').replace(dir + 'test/', './')
	)
);

fs.writeFileSync(
	dir + 'test/loader.js',
	`// prettier-ignore\nwindow.fileCasesJodit = ${JSON.stringify(list)};`
);

console.log(`Found: ${list.length} files`);
