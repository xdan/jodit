/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs';

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
