/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { makeIndexFile, readLangs, saveJson } from './helpers';

import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';

const argv = yargs
	.option('key', {
		type: 'string',
		demandOption: true,
		description: 'Translate key'
	})
	.option('keyTo', {
		type: 'string',
		description: 'Translate to key'
	})
	.option('from', {
		type: 'string',
		default: path.resolve(process.cwd(), 'src/langs'),
		description: 'Directory'
	})
	.option('dir', {
		type: 'string',
		demandOption: true,
		description: 'Target directory'
	})
	.parseSync();

const key = argv.key;
const keyTo: string = argv.keyTo || key;
const sourcePath = path.resolve(argv.from);
const targetPath = path.resolve(argv.dir);

if (sourcePath === targetPath && key === keyTo) {
	throw new Error(
		'Should have different source and target or different key and keyTo'
	);
}

console.info('Key:', key, 'To:', keyTo);

export default async (): Promise<void> => {
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
			const targetJSON: any = fs.existsSync(targetFilename)
				? require(targetFilename)
				: {};

			targetJSON[keyTo] = value;
			await saveJson(targetFilename, targetJSON);
		})
	);

	await makeIndexFile(targetPath, files);
};
