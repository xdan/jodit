/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2026 Valerii Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';

import * as webpack from 'webpack';

export default ({
	pkg,
	isProd,
	ESNext,
	ESModern,
	isTest,
	fat,
	ES,
	mode,
	uglify
}: Variables): webpack.DefinePlugin => {
	return new webpack.DefinePlugin({
		'process.env': {
			APP_VERSION: JSON.stringify(pkg.version),
			FAT_MODE: fat,
			MINIFIED: uglify,
			IS_PROD: isProd,
			IS_TEST: isTest,
			IS_ES_NEXT: ESNext,
			IS_ES_MODERN: ESModern,
			HOMEPAGE: JSON.stringify(pkg.homepage),
			TARGET_ES: JSON.stringify(ES),
			NODE_ENV: JSON.stringify(mode),
			TOKENS: JSON.stringify(
				Object.keys(process.env)
					.filter(key => key.startsWith('TOKEN_'))
					.reduce(
						(acc, key) => {
							acc[key] = process.env[key]!;
							return acc;
						},
						{} as Record<string, string>
					)
			)
		}
	});
};
