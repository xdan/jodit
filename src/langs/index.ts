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
import { isArray } from 'jodit/core/helpers/checker/is-array';

import * as ar from 'jodit/langs/ar';
import * as cs_cz from 'jodit/langs/cs_cz';
import * as de from 'jodit/langs/de';
import * as en from 'jodit/langs/en';
import * as es from 'jodit/langs/es';
import * as fr from 'jodit/langs/fr';
import * as he from 'jodit/langs/he';
import * as hu from 'jodit/langs/hu';
import * as id from 'jodit/langs/id';
import * as it from 'jodit/langs/it';
import * as ja from 'jodit/langs/ja';
import * as ko from 'jodit/langs/ko';
import * as mn from 'jodit/langs/mn';
import * as nl from 'jodit/langs/nl';
import * as pl from 'jodit/langs/pl';
import * as pt_br from 'jodit/langs/pt_br';
import * as ru from 'jodit/langs/ru';
import * as tr from 'jodit/langs/tr';
import * as zh_cn from 'jodit/langs/zh_cn';
import * as zh_tw from 'jodit/langs/zh_tw';

let exp: IDictionary<IDictionary<string>> = {};

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

import * as keys from 'jodit/langs/keys';

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
