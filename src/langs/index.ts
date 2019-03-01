/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */
import { default as de } from './de';
import { default as fr } from './fr';
import { default as ru } from './ru';
import { default as ar } from './ar';
import { default as zh_cn } from './zh_cn';
import { default as es } from './es';
import { default as nl } from './nl';
import { default as hu } from './hu';
import { default as tr } from './tr';
import { default as pt_br } from './pt_br';
import { default as en } from './en';
import { default as it } from './it';

const exp: any = {de, fr, ru, tr, ar, zh_cn, es, nl, hu, pt_br, en, it};

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
