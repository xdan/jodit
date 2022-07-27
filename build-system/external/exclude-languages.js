/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = ({ excludeLanguages }) => {
	if (
		excludeLanguages &&
		Array.isArray(excludeLanguages) &&
		excludeLanguages.filter(Boolean).length
	) {
		console.warn('Exclude languages:', excludeLanguages);

		return excludeLanguages.reduce((map, name) => {
			map[`./${name}.js`] = '{}';
			map[`jodit/langs/${name}`] = '{}';
			return map;
		}, {});
	}

	return {};
};
