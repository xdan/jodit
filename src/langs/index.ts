/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { default as ar } from './ar';
import { default as cs_cz } from './cs_cz';
import { default as de } from './de';
import { default as es } from './es';
import { default as fr } from './fr';
import { default as he } from './he';
import { default as hu } from './hu';
import { default as it } from './it';
import { default as nl } from './nl';
import { default as pt_br } from './pt_br';
import { default as ru } from './ru';
import { default as tr } from './tr';
import { default as zh_cn } from './zh_cn';
import { default as zh_tw } from './zh_tw';

import { default as en } from './en';


const exp: any = {
	ar,
	de,
	cs_cz,
	en,
	es,
	fr,
	he,
	hu,
	it,
	nl,
	pt_br,
	ru,
	tr,
	zh_cn,
	zh_tw
};

/* Unpack array to hash */
const hashLang: any = {};

(<any>en).forEach((key: string, index: number) => {
	hashLang[index] = key;
});

Object.keys(exp).forEach((lang: string) => {
	const list: unknown = exp[lang];

	if (Array.isArray(list)) {
		exp[lang] = {};
		list.forEach((value: string, index: number) => {
			exp[lang][hashLang[index]] = value;
		});
	}
});

export = exp;
