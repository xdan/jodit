/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2021 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const https = require('https');
const path = require('path');

const { argv } = require('yargs')
	.option('str', {
		type: 'string',
		required: true,
		description: 'Translate sentence'
	})
	.option('ytak', {
		type: 'string',
		required: true,
		description: 'Yandex Translate Api Key'
	})
	.option('dir', {
		type: 'string',
		default: path.resolve(process.cwd(), 'src/langs'),
		description: 'Directory'
	});

if (!argv.ytak) {
	throw new Error(
		'Need Yandex Translate API key. https://translate.yandex.com/developers/keys\n' +
			'You can run it file: node ./src/utils/lang-translater.js %api_key%'
	);
}

console.warn('Work directory:', argv.dir);

const translate = async (text, lang) => {
	return new Promise((resolve, reject) => {
		https
			.get(
				'https://translate.yandex.net/api/v1.5/tr.json/translate?' +
					`key=${argv.ytak}&text=${text}&lang=en-${lang}&format=plain`,
				res => {
					res.on('data', d => {
						const json = JSON.parse(d.toString());

						if (json.code !== 200) {
							return reject(lang + ':' + json.message);
						}

						return resolve(json.text[0]);
					});
				}
			)
			.on('error', e => {
				reject(e.message);
			});
	});
};

const fs = require('fs');

const folder = path.resolve(path.resolve(__dirname, '../langs'));
const files = fs.readdirSync(folder);

const replace = {
	cs_cz: 'cs',
	zh_cn: 'zh',
	zh_tw: 'th',
	pt_br: 'pt'
};

const header = fs.readFileSync(
	path.resolve(process.cwd(), './src/header.js'),
	'utf8'
);

const translateAll = text => {
	const langs = files
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

	langs.forEach(async ([lang, file]) => {
		const filepath = path.join(folder, file);
		const newFilePath = path.join(
			path.resolve(argv.dir),
			path.parse(filepath).base
		);

		const data = fs.existsSync(newFilePath) ? require(newFilePath) : {};

		if (!data[text]) {
			data[text] = await translate(text, lang);

			fs.writeFileSync(
				newFilePath,
				`${header}\nmodule.exports = ${JSON.stringify(
					data,
					null,
					'\t'
				)};`
			);
		}
	});

	const indexFile = path.join(path.resolve(argv.dir), 'index.ts');

	if (!fs.existsSync(indexFile)) {
		const folder = path.dirname(indexFile);

		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder, { recursive: true });
		}

		fs.writeFileSync(
			indexFile,
			`${header}\n${langs
				.map(
					// eslint-disable-next-line no-unused-vars
					([lang, file, realLang]) =>
						`const ${realLang} = require('./${file}');\n`
				)
				.join('')}\nexport default {${langs
				.map(([, , lang]) => lang)
				.join(',')}};`
		);
	}
};

translateAll(argv.str);
