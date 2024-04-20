/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import { fileName } from '../utils/filename';
import { PostBuild } from '../utils/post-build';

import autoprefixer from 'autoprefixer';
import * as fs from 'fs';
import * as path from 'path';
import postcss from 'postcss';
import postcssCssVariables from 'postcss-css-variables';

export default ({
	argv,
	ES,
	isTest,
	uglify,
	outputPath,
	banner
}: Variables): PostBuild => {
	return new PostBuild(async () => {
		const processor = postcss([
			autoprefixer({
				overrideBrowserslist: [
					'>1%',
					'last 4 versions',
					'Firefox ESR',
					'ie >= 11'
				]
			}),
			postcssCssVariables
		]);

		const file = path.resolve(
			outputPath,
			fileName({ argv, ES, isTest, uglify } as Variables)('jodit') +
				'.css'
		);

		const css = fs.readFileSync(file, 'utf-8');

		const result = await processor.process(css, { from: file, to: file });

		fs.writeFileSync(file, banner + result.css);
	});
};
