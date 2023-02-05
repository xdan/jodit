/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const glob = require('glob');
const path = require('path');
const fs = require('fs');

const dir = path.resolve(process.cwd()) + '/';
console.log('Find directory:', dir);

const list = [];
// options is optional
const srcFiles = glob.sync(dir + '?(src|test)/**/*.test.js');
list.push(
	...srcFiles.map(p =>
		p.replace(dir + 'src/', '../src/').replace(dir + 'test/', './')
	)
);

fs.writeFileSync(
	dir + 'test/loader.js',
	`window.fileCasesJodit = ${JSON.stringify(list)};`
);

console.log(`Found: ${list.length} files`);
