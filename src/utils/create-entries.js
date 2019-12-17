const path = require('path');
const fs = require('fs');

/**
 *
 * @param {string[]} entries
 */
function resolve(entries) {
	return entries.reduce((files, entry) => files.concat(resolveFiles(entry)), [])
}

function resolveFiles(directory) {
	const rootPath = path.resolve(process.cwd());
	const fullPath = path.resolve(directory);
	const files = fs.readdirSync(fullPath);

	return files.reduce((entries, file) => {
		const filename = path.join(fullPath, file);

		if (fs.lstatSync(filename).isFile()) {
			entries.push(filename.replace(rootPath, '.'));
		} else {
			Object.assign(entries, resolveFiles(filename))
		}

		return entries;
	}, [])
}

/**
 * Filter file list by extension
 *
 * @param {string[]} files
 * @param {Function} checker
 * @returns string[]
 */
function filter(files, checker) {
	return files.filter((file) => checker(path.extname(file).toLowerCase().substr(1)));
}

module.exports = {
	resolve,
	filter
};
