/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');
const fs = require('fs');

/**
 *
 * @param {string[]} entries
 */
function resolve(entries) {
	return entries.reduce(
		(files, entry) => files.concat(resolveFiles(entry)),
		[]
	);
}

function resolveFiles(entry) {
	const rootPath = process.cwd();
	const fullPath = path.resolve(rootPath, entry);

	const entryName = path.basename(fullPath);
	const list = [];

	['config.ts', 'ts', 'less', 'svg', 'png', 'jpeg', 'jpg'].forEach(ext => {
		const file = path.resolve(fullPath, `${entryName}.${ext}`);

		if (fs.existsSync(file)) {
			list.push(file);
		}
	});

	return list;
}

/**
 * Filter file list by extension
 *
 * @param {string[]} files
 * @param {Function} checker
 * @returns string[]
 */
function filter(files, checker) {
	return files.filter(file =>
		checker(path.extname(file).toLowerCase().substr(1))
	);
}

module.exports = {
	resolve,
	filter
};
