/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

module.exports = ({ excludeLanguages }) => {
	if (
		excludeLanguages &&
		Array.isArray(excludeLanguages) &&
		excludeLanguages.filter(Boolean).length
	) {
		console.info('Exclude languages:', excludeLanguages);

		return excludeLanguages.reduce((map, name) => {
			if (name === 'keys') {
				return map;
			}

			map[`./${name}.js`] = '{}';
			map[`jodit/langs/${name}`] = '{}';
			return map;
		}, {});
	}

	return {};
};
