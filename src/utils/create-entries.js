const path = require('path');
const fs = require('fs');

function createEntries(directory) {
	const rootPath = path.resolve(process.cwd());
	const fullPath = path.resolve(directory);
	const files = fs.readdirSync(fullPath);

	return files.reduce((entries, file) => {
		let filename = path.join(fullPath, file);

		if (fs.lstatSync(filename).isFile()) {
			filename = filename.replace(rootPath, '.');
			entries[filename.replace(/\.ts$/, '')] = filename;
		} else {
			Object.assign(entries, createEntries(filename))
		}

		return entries;
	}, {})
}

module.exports = {
	createEntries
};
