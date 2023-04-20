/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import * as path from 'path';
import { RuleSetRule } from 'webpack';

export default ({ superDirname }: Variables): RuleSetRule => {
	return {
		test: /\.(js)$/,
		use: [
			{
				loader: path.resolve(__dirname, '../loaders/lang-loader.js')
			}
		],
		include: path.resolve(superDirname, './src/langs'),
		exclude: path.resolve(superDirname, './src/langs/index.ts')
	};
};
