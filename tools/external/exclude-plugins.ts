/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';

import * as fs from 'fs';
import * as path from 'path';

export default ({
	excludePlugins,
	includePlugins,
	superDirname
}: Variables): { [key in string]: string } => {
	if (
		includePlugins &&
		Array.isArray(includePlugins) &&
		includePlugins.filter(Boolean).length
	) {
		console.info('Include plugins:', includePlugins);

		excludePlugins = fs
			.readdirSync(path.resolve(superDirname, './src/plugins'))
			.filter(
				(file: string) =>
					!file.match(/\.\w+$/) && !includePlugins.includes(file)
			);
	}

	if (
		excludePlugins &&
		Array.isArray(excludePlugins) &&
		excludePlugins.filter(Boolean).length
	) {
		console.info('Exclude plugins:', excludePlugins);

		return excludePlugins.reduce(
			(map, pluginName) => {
				map[`jodit/plugins/${pluginName}/${pluginName}`] = '{}';
				return map;
			},
			{} as { [key in string]: string }
		);
	}

	return {};
};
