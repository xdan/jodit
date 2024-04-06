/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const header = fs.readFileSync(
	path.resolve(__dirname, '../../../src/header.js'),
	'utf8'
);

const replace = {
	cs_cz: 'cs',
	zh_cn: 'zh',
	zh_tw: 'th',
	pt_br: 'pt'
} as const;

export const readLangs = function readLangs(
	dir: string
): Array<[string, string, string]> {
	return fs
		.readdirSync(dir)
		.filter(file => file !== 'README.md' && !file.includes('test'))
		.map(file => {
			let lang = file.replace(/\.(js|ts)$/, '');
			const realLang = lang;

			if (['index', 'en'].includes(lang)) {
				return ['', file, realLang];
			}

			if (lang in replace) {
				lang = replace[lang as keyof typeof replace];
			}

			return [lang, file, realLang] as const;
		})
		.filter(([lang]) => lang) as Array<[string, string, string]>;
};

async function prettier(fileName: string): Promise<void> {
	return new Promise((resolve, reject) => {
		exec(`prettier --write ${fileName}`, error => {
			if (error != null) {
				reject(error);
				return;
			}

			resolve();
		});
	});
}

export const saveJson = function saveJson(
	fileName: string,
	data: object
): Promise<void> {
	!fs.existsSync(path.dirname(fileName)) &&
		fs.mkdirSync(path.dirname(fileName), { recursive: true });

	fs.writeFileSync(
		fileName,
		`${header}\nmodule.exports = ${JSON.stringify(data, null, '\t')};`
	);

	return prettier(fileName);
};

export const makeIndexFile = function makeIndexFile(
	dir: string,
	langs: Array<[string, string, string]>
): Promise<void> {
	const indexFile = path.join(path.resolve(dir), 'index.ts');

	if (!fs.existsSync(indexFile)) {
		const folder = path.dirname(indexFile);

		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder, { recursive: true });
		}

		fs.writeFileSync(
			indexFile,
			`${header}\n${langs
				.map(
					([_, file, realLang]) =>
						`const ${realLang} = require('./${file}');\n`
				)
				.join('')}\nexport {${langs
				.map(([, , lang]) => lang)
				.join(',')}};`
		);

		return prettier(indexFile);
	}

	return Promise.resolve();
};
