import { IDictionary, ILanguageOptions } from '../../../types';
import { Config } from '../../../Config';
import { defaultLanguage as defineLanguage } from '../defaultLanguage';
import { ucfirst, isString } from '../';

/**
 * Simple variant sprintf function
 *
 * @param str
 * @param args
 */
export const sprintf = (str: string, args?: Array<string | number>): string => {
	if (!args || !args.length) {
		return str;
	}

	const reg = /%([sd])/g;

	let fnd = reg.exec(str);
	let res = str, i = 0;

	while (fnd && args[i] !== undefined) {
		res = res.replace(fnd[0], args[i].toString());
		i += 1;
		fnd = reg.exec(str)
	}

	return res;
};

/**
 * Internationalization method. Uses Jodit.lang object
 *
 * @param {string} key Some text
 * @param {string[]} params Some text
 * @return {string}
 * @example
 * ```javascript
 * var editor = new Jodit("#redactor", {
 *      langusage: 'ru'
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
export const i18n = (key: string, params?: Array<string | number>, options?: ILanguageOptions, safe: boolean = process.env.NODE_ENV === 'production'): string => {
	const debug: boolean = Boolean(options !== undefined && options.debugLanguage);

	let store: IDictionary;

	const
		parse = (value: string): string => (params && params.length) ? sprintf(value, params) : value,
		defaultLanguage = defineLanguage(Config.defaultOptions.language, Config.defaultOptions.language),
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

	if (Jodit.lang[language] !== undefined) {
		store = Jodit.lang[language];
	} else {
		if (Jodit.lang[defaultLanguage] !== undefined) {
			store = Jodit.lang[defaultLanguage];
		} else {
			store = Jodit.lang.en;
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

	if ( Jodit.lang.en && typeof Jodit.lang.en[key] === 'string' && Jodit.lang.en[key]) {
		return parse(Jodit.lang.en[key]);
	}

	if (debug) {
		return '{' + key + '}';
	}

	if (!safe && language !== 'en') {
		throw new TypeError(`i18n need "${key}" in "${language}"`);
	}

	return parse(key);
};

import { Jodit } from "../../../Jodit"
