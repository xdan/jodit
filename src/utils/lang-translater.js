const https = require('https');

const yandex_translate_api_key  = process.argv[2];

if (!yandex_translate_api_key) {
	throw new Error(
		'Need Yandex Translate API key. https://translate.yandex.com/developers/keys\n' +
		'You can run it file: node ./src/utils/lang-translater.js %api_key%'
	);
}

const translate = async (text, lang) => {
	return new Promise((resolve, reject) => {
		https
			.get(
				`https://translate.yandex.net/api/v1.5/tr.json/translate?`+
				`key=${yandex_translate_api_key}&text=${text}&lang=en-${lang}&format=plain`,
				res => {
					res.on('data', d => {
						const json = JSON.parse(d.toString());

						if (json.code !== 200) {
							return reject(lang + ':' +json.message);
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
const path = require('path');

const folder = path.resolve(__dirname, '../langs');
const files = fs.readdirSync(folder);

const replace = {
	cs_cz: 'cs',
	zh_cn: 'zh',
	zh_tw: 'th',
	pt_br: 'pt',
};

const translateAll = (text) => {
	files.forEach(async (file) => {
		const filename = path.join(folder, file);
		let lang = file.replace(/\.ts$/, '');

		if (['index', 'en'].includes(lang)) {
			return;
		}

		if (replace[lang]) {
			lang = replace[lang];
		}

		const data = fs.readFileSync(filename, 'utf-8');

		const end = data.indexOf('} as IDictionary<string>;');

		if (end !== -1) {
			const translated = await translate(text, lang);
			const
				newHash = data.substring(0, end - 1) + "\n\t'" +
					text.replace(/'/g, "\\'") + "': '" + translated.replace(/'/g, "\\'") + "',\n" +
					data.substring(end);

			fs.writeFileSync(filename, newHash);
		}
	});
};

translateAll('Show all');

