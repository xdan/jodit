/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from "../Jodit";
import {Config} from "../Config";
import {ButtonType, ControlType} from "../modules/Toolbar";
import {Alert, Dialog} from "../modules/Dialog";
import {dom} from "../modules/Helpers";
import {KEY_BOTTOM, KEY_ENTER, KEY_LEFT, KEY_RIGHT, KEY_TOP} from "../constants";

declare module "../Config" {
    interface Config {
        specialCharacters: string[],
    }
}

Config.prototype.specialCharacters = [
    '!', '&quot;', '#', '$', '%', '&amp;', "'", '(', ')', '*', '+', '-', '.', '/',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';',
    '&lt;', '=', '&gt;', '?', '@',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '[', ']', '^', '_', '`',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '{', '|', '}', '~',
    '&euro;', '&lsquo;', '&rsquo;', '&ldquo;', '&rdquo;', '&ndash;', '&mdash;', '&iexcl;', '&cent;', '&pound;',
    '&curren;', '&yen;', '&brvbar;', '&sect;', '&uml;', '&copy;', '&ordf;', '&laquo;', '&raquo;', '&not;', '&reg;', '&macr;',
    '&deg;', '&sup2;', '&sup3;', '&acute;', '&micro;', '&para;', '&middot;', '&cedil;', '&sup1;', '&ordm;',
    '&frac14;', '&frac12;', '&frac34;', '&iquest;', '&Agrave;', '&Aacute;', '&Acirc;', '&Atilde;', '&Auml;', '&Aring;',
    '&AElig;', '&Ccedil;', '&Egrave;', '&Eacute;', '&Ecirc;', '&Euml;', '&Igrave;', '&Iacute;', '&Icirc;', '&Iuml;',
    '&ETH;', '&Ntilde;', '&Ograve;', '&Oacute;', '&Ocirc;', '&Otilde;', '&Ouml;', '&times;', '&Oslash;', '&Ugrave;',
    '&Uacute;', '&Ucirc;', '&Uuml;', '&Yacute;', '&THORN;', '&szlig;', '&agrave;', '&aacute;', '&acirc;', '&atilde;',
    '&auml;', '&aring;', '&aelig;', '&ccedil;', '&egrave;', '&eacute;', '&ecirc;', '&euml;', '&igrave;', '&iacute;',
    '&icirc;', '&iuml;', '&eth;', '&ntilde;', '&ograve;', '&oacute;', '&ocirc;', '&otilde;', '&ouml;', '&divide;',
    '&oslash;', '&ugrave;', '&uacute;', '&ucirc;', '&uuml;', '&yacute;', '&thorn;', '&yuml;', '&OElig;', '&oelig;',
    '&#372;', '&#374', '&#373', '&#375;', '&sbquo;', '&#8219;', '&bdquo;', '&hellip;', '&trade;', '&#9658;', '&bull;',
    '&rarr;', '&rArr;', '&hArr;', '&diams;', '&asymp;'
];


Config.prototype.controls.symbol = <ControlType> {
    icon: 'omega',
    exec: (editor: Jodit) => {
        const container : HTMLElement | undefined = editor.events.fire('generateSpecialCharactersTable.symbols');
        if (container) {
            const dialog: Dialog = Alert(container, editor.i18n('Select Special Character'), void(0), 'jodit_symbols');
            const a: HTMLAnchorElement | null = container.querySelector('a');
            a && a.focus();
            editor.events.on('beforeDestruct', () => {
                dialog && dialog.close();
            });
        }
    }
};

/**
 * The plugin inserts characters that are not part of the standard keyboard.
 */
export class symbols {
    private countInRow: number = 20;
    constructor(editor: Jodit) {
        editor.events
            .on('generateSpecialCharactersTable.symbols', () => {
                const container: HTMLDivElement = editor.ownerDocument.createElement('div'),
                    // dialog: Dialog = new Dialog(editor),
                    table: HTMLTableElement = <HTMLTableElement>dom('<table><tbody></tbody></table>', editor.ownerDocument),
                    body: HTMLTableSectionElement = table.tBodies[0],
                    chars: HTMLAnchorElement[] = [];

                container.classList.add('jodit_symbols-container')

                for (let i: number = 0; i < editor.options.specialCharacters.length;) {
                    const tr: HTMLTableRowElement = editor.ownerDocument.createElement('tr');
                    for (let j: number = 0; j < this.countInRow && i < editor.options.specialCharacters.length; j += 1, i += 1) {
                        const td: HTMLTableCellElement = editor.ownerDocument.createElement('td'),
                            a: HTMLAnchorElement = <HTMLAnchorElement>dom(`<a data-index="${i}" data-index-j="${j}" href="javascript:void(0)" role="option" tabindex="-1">${editor.options.specialCharacters[i]}</a>`, editor.ownerDocument)

                        chars.push(a);
                        td.appendChild(a);
                        tr.appendChild(td)
                    }
                    body.appendChild(tr);
                }

                container.appendChild(table);

                editor.events
                    .on(chars, 'mousedown', function (this: HTMLAnchorElement, e: MouseEvent) {
                        if (this && this.nodeName === 'A') {
                            editor.events.fire(this, 'close_dialog');
                            editor.selection.insertHTML(this.innerHTML);
                            e.preventDefault();
                            e.stopImmediatePropagation()
                        }
                    })
                    .on(chars, 'mouseenter', function (this: HTMLAnchorElement) {
                        if (this && this.nodeName === 'A') {
                            this.focus();
                        }
                    })
                    .on(chars, 'keydown', (e: KeyboardEvent) => {
                        const target: HTMLAnchorElement = <HTMLAnchorElement>e.target;
                        if (target && target.nodeName === 'A') {
                            let index: number = parseInt(target.getAttribute('data-index') || '0', 0),
                                jIndex: number = parseInt(target.getAttribute('data-index-j') || '0', 0),
                                newIndex: number;
                            switch (e.which) {
                                case KEY_TOP:
                                case KEY_BOTTOM:
                                    newIndex = e.which === KEY_TOP ? index - this.countInRow : index + this.countInRow;
                                    if (chars[newIndex] === undefined) {
                                        newIndex = e.which === KEY_TOP ? Math.floor(chars.length / this.countInRow) * this.countInRow + jIndex : jIndex;
                                        if (newIndex > chars.length - 1) {
                                            newIndex -= this.countInRow;
                                        }
                                    }

                                    chars[newIndex] && chars[newIndex].focus();
                                    break;
                                case KEY_RIGHT:
                                case KEY_LEFT:
                                    newIndex = e.which === KEY_LEFT ? index - 1 : index + 1;
                                    if (chars[newIndex] === undefined) {
                                        newIndex = e.which === KEY_LEFT ? chars.length - 1 : 0;
                                    }
                                    chars[newIndex] && chars[newIndex].focus();
                                    break;
                                case KEY_ENTER:
                                    editor.events.fire(target, 'close_dialog');
                                    editor.selection.insertHTML(target.innerHTML);
                                    break;
                            }
                        }

                        e.stopImmediatePropagation();
                        e.preventDefault();
                    });

                return container;
            });
    }
}