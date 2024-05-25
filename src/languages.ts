/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2024 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * [[include:langs/README.md]]
 * @packageDocumentation
 * @module langs
 */

// @ts-nocheck

import type { IDictionary } from 'jodit/types';
import { isArray } from 'jodit/core/helpers/checker/is-array';

import ar from 'jodit/langs/ar';
import cs_cz from 'jodit/langs/cs_cz';
import de from 'jodit/langs/de';
import en from 'jodit/langs/en';
import es from 'jodit/langs/es';
import fi from 'jodit/langs/fi';
import fr from 'jodit/langs/fr';
import he from 'jodit/langs/he';
import hu from 'jodit/langs/hu';
import id from 'jodit/langs/id';
import it from 'jodit/langs/it';
import ja from 'jodit/langs/ja';
import keys from 'jodit/langs/keys';
import ko from 'jodit/langs/ko';
import mn from 'jodit/langs/mn';
import nl from 'jodit/langs/nl';
import pl from 'jodit/langs/pl';
import pt_br from 'jodit/langs/pt_br';
import ru from 'jodit/langs/ru';
import tr from 'jodit/langs/tr';
import ua from 'jodit/langs/ua';
import zh_cn from 'jodit/langs/zh_cn';
import zh_tw from 'jodit/langs/zh_tw';

let exp: IDictionary<IDictionary<string>> = {};

exp = {
	ar,
	cs_cz,
	de,
	en,
	es,
	fi,
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
	ua,
	zh_cn,
	zh_tw
};

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
