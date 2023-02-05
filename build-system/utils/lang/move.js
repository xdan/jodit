/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const path = require('path');
const { argv } = require('yargs')
	.option('key', {
		type: 'string',
		required: true,
		description: 'Translate key'
	})
	.option('key-to', {
		type: 'string',
		description: 'Translate to key'
	})
	.option('from', {
		type: 'string',
		default: path.resolve(process.cwd(), 'src/langs'),
		description: 'Directory'
	});

const fs = require('fs');
const { saveJson, readLangs, makeIndexFile } = require('./helpers');

const key = argv.key;
const keyTo = argv.keyTo || key;
const sourcePath = path.resolve(argv.from);
const targetPath = path.resolve(argv.dir);

if (sourcePath === targetPath && key === keyTo) {
	throw new Error(
		'Should have different source and target or different key and keyTo'
	);
}

console.info('Key:', key, 'To:', keyTo);

module.exports = async () => {
	const files = readLangs(sourcePath);

	await Promise.all(
		files.map(async ([_, file]) => {
			const sourceFilename = path.resolve(sourcePath, file);
			const json = require(sourceFilename);
			if (!json[key]) {
				console.info(`File ${file} does not have key ${key}`);
				return;
			}

			const value = json[key];
			delete json[key];
			await saveJson(sourceFilename, json);

			const targetFilename = path.resolve(targetPath, file);
			const targetJSON = fs.existsSync(targetFilename)
				? require(targetFilename)
				: {};

			targetJSON[keyTo] = value;
			await saveJson(targetFilename, targetJSON);
		})
	);

	await makeIndexFile(targetPath, files);
};
