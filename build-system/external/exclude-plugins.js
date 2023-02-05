/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = ({ excludePlugins }) => {
	if (
		excludePlugins &&
		Array.isArray(excludePlugins) &&
		excludePlugins.filter(Boolean).length
	) {
		console.info('Exclude plugins:', excludePlugins);

		return excludePlugins.reduce((map, pluginName) => {
			map[`jodit/plugins/${pluginName}/${pluginName}`] = '{}';
			return map;
		}, {});
	}

	return {};
};
