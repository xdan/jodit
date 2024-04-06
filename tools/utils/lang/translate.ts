/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { makeIndexFile, readLangs, saveJson } from './helpers';

import request from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';

const argv = yargs
	.option('str', {
		type: 'string',
		demandOption: true,
		description: 'Translate sentence'
	})
	.option('ytak', {
		type: 'string',
		demandOption: true,
		description: 'Yandex Translate Api Key'
	})
	.option('folder', {
		type: 'string',
		demandOption: true,
		description: 'Yandex Translate Api Folder'
	})
	.option('dir', {
		type: 'string',
		demandOption: true
	})
	.parseSync();

if (!argv.ytak || !argv.folder) {
	throw new Error(
		'Need Yandex Translate API key. https://translate.yandex.com/developers/keys\n' +
			'You can run it file: node ./src/utils/lang-translater.js %api_key%'
	);
}

async function getToken(): Promise<{ iamToken: string }> {
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

async function translate(text: string, lang = 'ru'): Promise<string | void> {
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

const folder = path.resolve(path.resolve(__dirname, '../../../src/langs'));

const translateAll = (text: string): Promise<void> => {
	const langs = readLangs(folder);

	langs.forEach(async ([lang, file]) => {
		const filepath = path.join(folder, file);
		const newFilePath = path.join(
			path.resolve(argv.dir as string),
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

module.exports = async (): Promise<void> => {
	await translateAll(argv.str);
};
