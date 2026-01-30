/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import type { LoaderContext } from 'webpack';

/**
 * In inherited assemblies, we replace the ESM Constants with TS Constant Constants to work replacements of Webpack.defineplugin
 */
export default function (
	this: LoaderContext<{ superDirname: string }>,
	source: string
): string {
	this.cacheable && this.cacheable(true);

	if (
		this.resourcePath.endsWith('/node_modules/jodit/esm/core/constants.js')
	) {
		return fs.readFileSync(
			path.resolve(
				this.getOptions().superDirname,
				'./src/core/constants.ts'
			),
			'utf-8'
		);
	}

	return source;
}
