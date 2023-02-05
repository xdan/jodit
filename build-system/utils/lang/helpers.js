/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const header = fs.readFileSync(
	path.resolve(__dirname, '../../../src/header.js'),
	'utf8'
);

const replace = {
	cs_cz: 'cs',
	zh_cn: 'zh',
	zh_tw: 'th',
	pt_br: 'pt'
};

module.exports.readLangs = function readLangs(dir) {
	return fs
		.readdirSync(dir)
		.filter(file => file !== 'README.md' && !file.includes('test'))
		.map(file => {
			let lang = file.replace(/\.(js|ts)$/, '');
			const realLang = lang;

			if (['index', 'en'].includes(lang)) {
				return ['', file, realLang];
			}

			if (replace[lang]) {
				lang = replace[lang];
			}

			return [lang, file, realLang];
		})
		.filter(([lang]) => lang);
};

async function prettier(fileName) {
	return new Promise((resolve, reject) => {
		exec(`prettier --write ${fileName}`, error => {
			if (error != null) {
				reject(error);
				return;
			}

			resolve();
		});
	});
};

module.exports.saveJson = function saveJson(fileName, data) {
	!fs.existsSync(path.dirname(fileName)) &&
		fs.mkdirSync(path.dirname(fileName), { recursive: true });

	fs.writeFileSync(
		fileName,
		`${header}\nmodule.exports = ${JSON.stringify(data, null, '\t')};`
	);

	return prettier(fileName);
};

module.exports.makeIndexFile = function makeIndexFile(dir, langs) {
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
};
