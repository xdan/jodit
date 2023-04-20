/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import { PostBuild } from '../utils/post-build';
import { fileName } from '../utils/filename';
import * as postcss from 'postcss';
import * as path from 'path';
import * as fs from 'fs';
import * as autoprefixer from 'autoprefixer';
import * as postcssCssVariables from 'postcss-css-variables';

export default ({
	argv,
	ES,
	isTest,
	excludeLangs,
	uglify,
	outputPath,
	banner
}: Variables): PostBuild => {
	return new PostBuild(() => {
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
			fileName({ argv, ES, isTest, excludeLangs, uglify } as Variables)(
				'jodit'
			) + '.css'
		);

		fs.readFile(file, (err, css) => {
			if (err) {
				console.log(err);
				return;
			}

			processor.process(css, { from: file, to: file }).then(result => {
				fs.writeFile(file, banner + result.css, () => true);
			});
		});
	});
};
