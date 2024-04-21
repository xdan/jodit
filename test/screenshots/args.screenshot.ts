/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import fs from 'fs';
import path from 'path';

const args = {
	build: process.env.BUILD,
	debug: process.env.DEBUG === 'true',
	min: process.env.MIN === 'true',
	fat: process.env.FAT === 'true'
} as const;

if (!args.build) {
	throw new Error('Build type is not defined');
}

const jsFile = path.resolve(
	__dirname,
	'../../build',
	args.build,
	'jodit.' + (args.fat ? 'fat.' : '') + (args.min ? 'min.' : '') + 'js'
);

if (!fs.existsSync(jsFile)) {
	throw new Error('File ' + jsFile + ' not found');
}

export { args };
