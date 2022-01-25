/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module helpers/string
 */

import type { IDictionary, ILanguageOptions } from 'jodit/types';
import { Config } from 'jodit/config';
import {
	defaultLanguage as defineLanguage,
	error
} from 'jodit/core/helpers/utils';
import { isString } from 'jodit/core/helpers/checker';
import { ucfirst } from 'jodit/core/helpers/string';
import { lang } from 'jodit/core/global';

/**
 * Simple variant sprintf function
 */
// declare const isProd: boolean;
export const sprintf = (str: string, args?: Array<string | number>): string => {
	if (!args || !args.length) {
		return str;
	}

	const reg = /%([sd])/g;

	let fnd = reg.exec(str);
	let res = str,
		i = 0;

	while (fnd && args[i] !== undefined) {
		res = res.replace(fnd[0], args[i].toString());
		i += 1;
		fnd = reg.exec(str);
	}

	return res;
};

/**
 * Internationalization method. Uses Jodit.lang object
 * @example
 * ```javascript
 * var editor = new Jodit("#redactor", {
 *      language: 'ru'
 * });
 * console.log(editor.i18n('Cancel')) //Отмена;
 *
 * Jodit.defaultOptions.language = 'ru';
 * console.log(Jodit.prototype.i18n('Cancel')) //Отмена
 *
 * Jodit.lang.cs = {
 *    Cancel: 'Zrušit'
 * };
 * Jodit.defaultOptions.language = 'cs';
 * console.log(Jodit.prototype.i18n('Cancel')) //Zrušit
 *
 * Jodit.lang.cs = {
 *    'Hello world': 'Hello \s Good \s'
 * };
 * Jodit.defaultOptions.language = 'cs';
 * console.log(Jodit.prototype.i18n('Hello world', 'mr.Perkins', 'day')) //Hello mr.Perkins Good day
 * ```
 */
export const i18n = (
	key: string,
	params?: Array<string | number>,
	options?: ILanguageOptions
): string => {
	if (!isString(key)) {
		throw error('i18n: Need string in first argument');
	}

	if (!key.length) {
		return key;
	}

	const debug: boolean = Boolean(
		options !== undefined && options.debugLanguage
	);

	let store: IDictionary;

	const parse = (value: string): string =>
			params && params.length ? sprintf(value, params) : value,
		defaultLanguage = defineLanguage(
			Config.defaultOptions.language,
			Config.defaultOptions.language
		),
		language = defineLanguage(options?.language, defaultLanguage),
		tryGet = (store: IDictionary): string | undefined => {
			if (!store) {
				return;
			}

			if (isString(store[key])) {
				return parse(store[key]);
			}

			const lcKey = key.toLowerCase();

			if (isString(store[lcKey])) {
				return parse(store[lcKey]);
			}

			const ucfKey = ucfirst(key);

			if (isString(store[ucfKey])) {
				return parse(store[ucfKey]);
			}

			return;
		};

	if (lang[language] !== undefined) {
		store = lang[language];
	} else {
		if (lang[defaultLanguage] !== undefined) {
			store = lang[defaultLanguage];
		} else {
			store = lang.en;
		}
	}

	const i18nOvr = options?.i18n;

	if (i18nOvr && i18nOvr[language]) {
		const result = tryGet(i18nOvr[language]);

		if (result) {
			return result;
		}
	}

	const result = tryGet(store);

	if (result) {
		return result;
	}

	if (lang.en && isString(lang.en[key]) && lang.en[key]) {
		return parse(lang.en[key]);
	}

	if (debug) {
		return '{' + key + '}';
	}

	if (!isProd && language !== 'en') {
		console.warn(`i18n need "${key}" in "${language}"`);
	}

	return parse(key);
};
