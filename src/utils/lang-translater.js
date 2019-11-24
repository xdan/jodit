const https = require('https');

const yandex_translate_api_key  =
	'';

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

// translate('Hi guys', 'ru').then(a => console.log(a), b => console.log(b));

const fs = require('fs');
const path = require('path');

const folder = path.resolve(__dirname, '../langs');
const files = fs.readdirSync(folder);

const translateAll = (text) => {
	files.forEach(async (file) => {
		const filename = path.join(folder, file);
		const data = fs.readFileSync(filename, 'utf-8');

		const end = data.indexOf('} as IDictionary<string>;');

		if (end !== -1) {
			const lang = file.replace(/\.ts$/, '');
			const translated = await translate(text, lang);
			const newHash = data.substring(0, end - 1) + "\n\t'" + text + "': '" + translated + "',\n" + data.substring(end);

			fs.writeFileSync(filename, newHash);
		}
	});
};

translateAll('Hi');

