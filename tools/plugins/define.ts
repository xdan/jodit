/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';
import * as webpack from 'webpack';

export default ({
	pkg,
	isProd,
	ESNext,
	ESModern,
	isTest,
	ES,
	mode
}: Variables): webpack.DefinePlugin => {
	return new webpack.DefinePlugin({
		'process.env': {
			APP_VERSION: JSON.stringify(pkg.version),
			IS_PROD: isProd,
			IS_TEST: isTest,
			IS_ES_NEXT: ESNext,
			IS_ES_MODERN: ESModern,
			HOMEPAGE: JSON.stringify(pkg.homepage),
			TARGET_ES: JSON.stringify(ES),
			NODE_ENV: JSON.stringify(mode)
		}
	});
};
