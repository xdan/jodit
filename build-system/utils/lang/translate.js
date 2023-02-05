/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

const request = require('axios');
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
	.option('folder', {
		type: 'string',
		required: true,
		description: 'Yandex Translate Api Folder'
	});

if (!argv.ytak || !argv.folder) {
	throw new Error(
		'Need Yandex Translate API key. https://translate.yandex.com/developers/keys\n' +
			'You can run it file: node ./src/utils/lang-translater.js %api_key%'
	);
}

async function getToken() {
	return request('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8'
		},
		data: JSON.stringify({
			yandexPassportOauthToken: argv.ytak
		})
	}).then(resp => resp.data);
}

async function translate(text, lang = 'ru') {
	try {
		const { iamToken } = await getToken();

		const data = await request
			.post(
				'https://translate.api.cloud.yandex.net/translate/v2/translate',
				{
					folderId: argv.folder,
					texts: [text],
					targetLanguageCode: lang
				},
				{
					headers: {
						Authorization: 'Bearer ' + iamToken
					}
				}
			)
			.then(resp => resp.data);

		if (
			data &&
			Array.isArray(data.translations) &&
			data.translations[0] &&
			data.translations[0].text
		) {
			return data.translations[0].text;
		}

		return text;
	} catch (e) {
		console.log(e);
	}
}

const fs = require('fs');
const { saveJson, readLangs, makeIndexFile } = require('./helpers');

const folder = path.resolve(path.resolve(__dirname, '../../../src/langs'));

const translateAll = text => {
	const langs = readLangs(folder);

	langs.forEach(async ([lang, file]) => {
		const filepath = path.join(folder, file);
		const newFilePath = path.join(
			path.resolve(argv.dir),
			path.parse(filepath).base
		);

		const data = fs.existsSync(newFilePath) ? require(newFilePath) : {};

		if (!data[text]) {
			data[text] = await translate(text, lang);
			saveJson(newFilePath, data);
		}
	});

	return makeIndexFile(path.resolve(argv.dir), langs);
};

module.exports = async () => {
	await translateAll(argv.str);
};
