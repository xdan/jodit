/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module plugins/symbols
 */

import type { IControlType, IJodit } from 'jodit/types';
import { Config } from 'jodit/config';
import { Alert } from 'jodit/modules/dialog';

declare module 'jodit/config' {
	interface Config {
		specialCharacters: string[];
		usePopupForSpecialCharacters: boolean;
	}
}

Config.prototype.usePopupForSpecialCharacters = false;

Config.prototype.specialCharacters = [
	'!',
	'&quot;',
	'#',
	'$',
	'%',
	'&amp;',
	"'",
	'(',
	')',
	'*',
	'+',
	'-',
	'.',
	'/',
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	':',
	';',
	'&lt;',
	'=',
	'&gt;',
	'?',
	'@',
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	'[',
	']',
	'^',
	'_',
	'`',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
	'{',
	'|',
	'}',
	'~',
	'&euro;',
	'&lsquo;',
	'&rsquo;',
	'&ldquo;',
	'&rdquo;',
	'&ndash;',
	'&mdash;',
	'&iexcl;',
	'&cent;',
	'&pound;',
	'&curren;',
	'&yen;',
	'&brvbar;',
	'&sect;',
	'&uml;',
	'&copy;',
	'&ordf;',
	'&laquo;',
	'&raquo;',
	'&not;',
	'&reg;',
	'&macr;',
	'&deg;',
	'&sup2;',
	'&sup3;',
	'&acute;',
	'&micro;',
	'&para;',
	'&middot;',
	'&cedil;',
	'&sup1;',
	'&ordm;',
	'&frac14;',
	'&frac12;',
	'&frac34;',
	'&iquest;',
	'&Agrave;',
	'&Aacute;',
	'&Acirc;',
	'&Atilde;',
	'&Auml;',
	'&Aring;',
	'&AElig;',
	'&Ccedil;',
	'&Egrave;',
	'&Eacute;',
	'&Ecirc;',
	'&Euml;',
	'&Igrave;',
	'&Iacute;',
	'&Icirc;',
	'&Iuml;',
	'&ETH;',
	'&Ntilde;',
	'&Ograve;',
	'&Oacute;',
	'&Ocirc;',
	'&Otilde;',
	'&Ouml;',
	'&times;',
	'&Oslash;',
	'&Ugrave;',
	'&Uacute;',
	'&Ucirc;',
	'&Uuml;',
	'&Yacute;',
	'&THORN;',
	'&szlig;',
	'&agrave;',
	'&aacute;',
	'&acirc;',
	'&atilde;',
	'&auml;',
	'&aring;',
	'&aelig;',
	'&ccedil;',
	'&egrave;',
	'&eacute;',
	'&ecirc;',
	'&euml;',
	'&igrave;',
	'&iacute;',
	'&icirc;',
	'&iuml;',
	'&eth;',
	'&ntilde;',
	'&ograve;',
	'&oacute;',
	'&ocirc;',
	'&otilde;',
	'&ouml;',
	'&divide;',
	'&oslash;',
	'&ugrave;',
	'&uacute;',
	'&ucirc;',
	'&uuml;',
	'&yacute;',
	'&thorn;',
	'&yuml;',
	'&OElig;',
	'&oelig;',
	'&#372;',
	'&#374',
	'&#373',
	'&#375;',
	'&sbquo;',
	'&#8219;',
	'&bdquo;',
	'&hellip;',
	'&trade;',
	'&#9658;',
	'&bull;',
	'&rarr;',
	'&rArr;',
	'&hArr;',
	'&diams;',
	'&asymp;'
];

Config.prototype.controls.symbol = {
	icon: 'omega',
	hotkeys: ['ctrl+shift+i', 'cmd+shift+i'],
	tooltip: 'Insert Special Character',
	popup: (editor: IJodit, current, control, close): any => {
		const container: HTMLElement | undefined = editor.e.fire(
			'generateSpecialCharactersTable.symbols'
		);

		if (container) {
			if (editor.o.usePopupForSpecialCharacters) {
				const box = editor.c.div();

				box.classList.add('jodit-symbols');
				box.appendChild(container);
				editor.e.on(container, 'close_dialog', close);
				return box;
			} else {
				Alert(
					container,
					editor.i18n('Select Special Character'),
					undefined,
					'jodit-symbols'
				).bindDestruct(editor);

				const a = container.querySelector('a');

				a && a.focus();
			}
		}
	}
} as IControlType;
