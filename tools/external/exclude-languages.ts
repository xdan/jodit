/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import * as fs from 'fs';
import * as path from 'path';
import { type Variables } from '../variables';

export default ({
	excludeLanguages,
	includeLanguages,
	superDirname
}: Variables): { [key in string]: string } => {
	if (
		includeLanguages &&
		Array.isArray(includeLanguages) &&
		includeLanguages.filter(Boolean).length
	) {
		console.info('Include languages:', includeLanguages);

		excludeLanguages = fs
			.readdirSync(path.resolve(superDirname, './src/langs'))
			.filter(
				(file: string) =>
					file.match(/\.js$/) && !file.match(/(test|keys)\.js$/)
			)
			.map(file => file.replace(/\.js$/, ''))
			.filter(file => !includeLanguages.includes(file));
	}

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
