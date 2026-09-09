/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs';
import * as path from 'path';

const args = {
	build: process.env.BUILD,
	debug: process.env.DEBUG === 'true',
	min: process.env.MIN === 'true',
	fat: process.env.FAT === 'true'
} as const;

if (!args.build) {
	throw new Error('Build type is not defined');
}

/**
 * Playwright is started from the root of the project under test
 * (`/app` inside the docker image), so the build is resolved relative to it.
 */
const jsFile = path.resolve(
	process.cwd(),
	'build',
	args.build,
	'jodit.' + (args.fat ? 'fat.' : '') + (args.min ? 'min.' : '') + 'js'
);

if (!fs.existsSync(jsFile)) {
	throw new Error('File ' + jsFile + ' not found');
}

export { args };
