/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import type { Variables } from '../variables';

export default ({ excludePlugins }: Variables): { [key in string]: string } => {
	if (
		excludePlugins &&
		Array.isArray(excludePlugins) &&
		excludePlugins.filter(Boolean).length
	) {
		console.info('Exclude plugins:', excludePlugins);

		return excludePlugins.reduce((map, pluginName) => {
			map[`jodit/plugins/${pluginName}/${pluginName}`] = '{}';
			return map;
		}, {} as { [key in string]: string });
	}

	return {};
};
