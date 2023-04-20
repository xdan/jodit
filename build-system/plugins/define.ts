/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Variables } from '../variables';
import * as webpack from 'webpack';

export default ({
	pkg,
	isProd,
	ESNext,
	isTest,
	ES,
	mode,
	excludeLangs
}: Variables): webpack.DefinePlugin => {
	return new webpack.DefinePlugin({
		appVersion: JSON.stringify(pkg.version),
		isProd,
		isTest,
		isESNext: ESNext,
		'process.env': {
			HOMEPAGE: JSON.stringify(pkg.homepage),
			TARGET_ES: JSON.stringify(ES),
			NODE_ENV: JSON.stringify(mode),
			EXCLUDE_LANGS: JSON.stringify(excludeLangs)
		}
	});
};
