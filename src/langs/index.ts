/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:langs/README.md]]
 * @packageDocumentation
 * @module langs
 */

import type { IDictionary } from 'jodit/types';
import { isArray } from '../core/helpers/checker';

let exp: IDictionary<IDictionary<string>> = {};

if (!process.env.EXCLUDE_LANGS) {
	const ar = require('jodit/langs/ar');
	const cs_cz = require('jodit/langs/cs_cz');
	const de = require('jodit/langs/de');
	const en = require('jodit/langs/en');
	const es = require('jodit/langs/es');
	const fr = require('jodit/langs/fr');
	const he = require('jodit/langs/he');
	const hu = require('jodit/langs/hu');
	const id = require('jodit/langs/id');
	const it = require('jodit/langs/it');
	const ja = require('jodit/langs/ja');
	const ko = require('jodit/langs/ko');
	const mn = require('jodit/langs/mn');
	const nl = require('jodit/langs/nl');
	const pl = require('jodit/langs/pl');
	const pt_br = require('jodit/langs/pt_br');
	const ru = require('jodit/langs/ru');
	const tr = require('jodit/langs/tr');
	const zh_cn = require('jodit/langs/zh_cn');
	const zh_tw = require('jodit/langs/zh_tw');

	exp = {
		ar,
		cs_cz,
		de,
		en,
		es,
		fr,
		he,
		hu,
		id,
		it,
		ja,
		ko,
		mn,
		nl,
		pl,
		pt_br,
		ru,
		tr,
		zh_cn,
		zh_tw
	};
}

const keys = require('jodit/langs/keys');

/* Unpack array to hash */
const get = (value: IDictionary): IDictionary =>
		value ? value.default || value : {},
	hashLang: IDictionary = {};

if (isArray(get(keys))) {
	get(keys).forEach((key: string, index: number) => {
		hashLang[index] = key;
	});
}

Object.keys(exp).forEach((lang: string) => {
	const list: unknown = get(exp[lang]);

	if (isArray(list)) {
		exp[lang] = {};

		list.forEach((value: string, index: number) => {
			exp[lang][hashLang[index]] = value;
		});
	} else {
		exp[lang] = list as IDictionary;
	}
});

export default exp;
