/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

export const defaultLanguage = (language?: string): string =>
    language === 'auto' || language === undefined
        ? (document.documentElement && document.documentElement.lang) ||
          (navigator.language && navigator.language.substr(0, 2)) ||
          ((navigator as any).browserLanguage
              ? (navigator as any).browserLanguage.substr(0, 2)
              : false) ||
          'en'
        : language;
