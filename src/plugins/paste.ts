/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Confirm, Dialog} from '../modules/Dialog';
import {
    isHTML, browser, htmlentities, htmlspecialchars, isHTMLFromWord, applyStyles, dom,
    cleanFromWord
} from '../modules/Helpers';
import {Config} from '../Config'
import {TEXT_HTML, TEXT_PLAIN} from "../constants";

/**
 * @property{boolean} askBeforePasteHTML=true Ask before paste HTML in WYSIWYG mode
 */
declare module "../Config" {
    interface Config {
        askBeforePasteHTML: boolean;
        askBeforePasteFromWord: boolean;
    }
}
Config.prototype.askBeforePasteHTML = true;
Config.prototype.askBeforePasteFromWord = true;

/**
 * Ask before paste HTML source
 *
 * @module insertHTML
 */
export function paste(editor: Jodit) {
    editor.events.on('paste', (event: ClipboardEvent): false | void => {
        /**
         * Triggered before pasting something into the Jodit Editor
         *
         * @event beforePaste
         * @param {ClipboardEvent} event
         * @return Returning false in the handler assigned toWYSIWYG the event will cancel the current action.
         * @example
         * ```javascript
         * var editor = new Jodit("#redactor");
         * editor.events.on('beforePaste', function (event) {
             *     return false; // deny paste
             * });
         * ```
         */

        if (editor.events.fire('beforePaste', event) === false) {
            event.preventDefault();
            return false;
        }

        if (event && event.clipboardData && event.clipboardData.getData) {
            let i,
                types = event.clipboardData.types,
                types_str: string = '',
                clipboard_html: any = '';

            if (Array.isArray(types)) {
                for (i = 0; i < types.length; i += 1) {
                    types_str += types[i] + ";";
                }
            } else {
                types_str = types;
            }

            if (/text\/html/.test(types_str)) {
                clipboard_html = event.clipboardData.getData("text/html");
            } else if (/text\/rtf/.test(types_str) && browser('safari')) {
                clipboard_html = event.clipboardData.getData("text/rtf");
            } else if (/text\/plain/.test(types_str) && !browser('mozilla')) {
                clipboard_html = htmlentities(event.clipboardData.getData(TEXT_PLAIN)).replace(/\n/g, "<br/>");
            }

            if (clipboard_html !== '' || clipboard_html instanceof (<any>editor.editorWindow).Node) {
                /**
                 * Triggered after the content is pasted from the clipboard into the Jodit. If a string is returned the new string will be used as the pasted content.
                 *
                 * @event beforePaste
                 * @param {ClipboardEvent} event
                 * @return Return {string|undefined}
                 * @example
                 * ```javascript
                 * var editor = new Jodit("#redactor");
                 * editor.events.on('beforePaste', function (event) {
                     *     return false; // deny paste
                     * });
                 * ```
                 */

                clipboard_html = editor.events.fire('processPaste', event, clipboard_html);

                if (typeof clipboard_html === 'string' || clipboard_html instanceof (<any>editor.editorWindow).Node) {
                    editor.selection.insertHTML(clipboard_html);
                }
                event.preventDefault();
                event.stopPropagation();
            }
        }

        /**
         * Triggered after pasting something into the Jodit
         *
         * @event afterPaste
         * @param {ClipboardEvent} event
         * @return Return {string|undefined}
         * @example
         * ```javascript
         * var editor = new Jodit("#redactor");
         * editor.events.on('afterPaste', function (event) {
             *     return false; // deny paste
             * });
         * ```
         */
        if (editor.events.fire('afterPaste', event) === false) {
            return false;
        }
    });
    const strip_tags: Function = (html: string): string => {
        const div: HTMLDivElement = document.createElement('div');
        div.innerHTML = html;
        return div.innerText;
    };
    const ClearOrKeep: Function = (msg: string, title: string, callback: (yes: boolean | number) => void, clearButton: string = 'Clean', clear2Button: string = 'Insert only Text'): Dialog => {
        const dialog: Dialog = Confirm(`<div style="word-break: normal; white-space: normal">${msg}</div>`, title, callback);

        const keep: HTMLAnchorElement  = <HTMLAnchorElement>dom(
            '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
                '<span>' + Jodit.prototype.i18n('Keep') + '</span>' +
            '</a>',
            dialog.document
        );

        const clear: HTMLAnchorElement  = <HTMLAnchorElement>dom(
            '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
                '<span>' + Jodit.prototype.i18n(clearButton) + '</span>' +
            '</a>',
            dialog.document
        );

        const clear2: HTMLAnchorElement  = <HTMLAnchorElement>dom(
            '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
            '<span>' + Jodit.prototype.i18n(clear2Button) + '</span>' +
            '</a>',
            dialog.document
        );

        const cancel: HTMLAnchorElement  = <HTMLAnchorElement>dom(
            '<a href="javascript:void(0)" style="float:right;" class="jodit_button">' +
                '<span>' + Jodit.prototype.i18n('Cancel') + '</span>' +
            '</a>',
            dialog.document
        );

        editor.events.on(keep, 'click', () => {
            dialog.close();
            callback && callback(true);
        });

        editor.events.on(clear, 'click', () => {
            dialog.close();
            callback && callback(false);
        });
        editor.events.on(clear2, 'click', () => {
            dialog.close();
            callback && callback(0);
        });

        editor.events.on(cancel, 'click', () => {
            dialog.close();
        });

        dialog.setFooter([
            keep,
            clear,
            clear2Button ? clear2 : '',
            cancel,
        ]);

        return dialog;
    };
    const insertHTML: Function = (html: string) : void | false => {
        if (isHTML(html)) {
            ClearOrKeep(editor.i18n('Your code is similar to HTML. Keep as HTML?'), editor.i18n('Paste as HTML'), (agree: boolean | number) => {
                if (agree === false) {
                    html = htmlspecialchars(html);
                }

                if (agree === 0) {
                    html = strip_tags(html);
                }

                editor.selection.insertHTML(html);
                editor.setEditorValue();
            }, 'Insert as Text');
            return false;
        }
    };
    if (editor.options.askBeforePasteHTML) {
        editor.events
            .on('beforePaste', (event: ClipboardEvent): false | void => {
                if (event && event.clipboardData && event.clipboardData.getData && event.clipboardData.getData(TEXT_PLAIN)) {
                    let html: string = event.clipboardData.getData(TEXT_PLAIN);
                    return insertHTML(html);
                }
            });
    }

    if (editor.options.askBeforePasteFromWord) {
        editor.events
            .on('beforePaste', (event: ClipboardEvent): false | void => {
                if (event && event.clipboardData && event.clipboardData.getData && event.clipboardData.getData(TEXT_HTML)) {
                    const processHTMLData: Function = (html: string): void | false => {
                        if (isHTML(html)) {
                            if (isHTMLFromWord(html)) {
                                ClearOrKeep(editor.i18n('The pasted content is coming from a Microsoft Word/Excel document. Do you want to keep the format or clean it up?'), editor.i18n('Word Paste Detected'), (agree: boolean | number) => {
                                    if (agree === true) {
                                        html = applyStyles(html);

                                        if (editor.options.beautifyHTML && (<any>editor.ownerWindow)['html_beautify']) {
                                            html = (<any>editor.ownerWindow)['html_beautify'](html);
                                        }
                                    }
                                    if (agree === false) {
                                        html = cleanFromWord(html);
                                    }

                                    if (agree === 0) {
                                        html = strip_tags(cleanFromWord(html));
                                    }

                                    editor.selection.insertHTML(html);
                                    editor.setEditorValue();
                                });
                            } else {
                                insertHTML(html);
                            }
                            return false;
                        }
                    };

                    if (event.clipboardData.types && event.clipboardData.types.indexOf("text/html") !== -1) {
                        let html: string = event.clipboardData.getData(TEXT_HTML);
                        return processHTMLData(html);
                    } else {
                        const div: HTMLDivElement = <HTMLDivElement>dom('<div tabindex="-1" style="left: -9999px; top: 0; width: 0; height: 100%; line-height: 140%; overflow: hidden; position: fixed; z-index: 2147483647; -ms-word-break: break-all;" contenteditable="true"></div>', editor.ownerDocument);
                        editor.container.appendChild(div);
                        div.focus();
                        let tick: number = 0;
                        const waitData: Function = () => {
                            tick += 1;
                            // If data has been processes by browser, process it
                            if (div.childNodes && div.childNodes.length > 0) {
                                const pastedData: string = div.innerHTML;
                                div.parentNode && div.parentNode.removeChild(div);
                                if (processHTMLData(pastedData) !== false) {
                                    editor.selection.insertHTML(pastedData);
                                }
                            } else {
                                if (tick < 5) {
                                    setTimeout(function () {
                                        waitData()
                                    }, 20);
                                } else {
                                    div.parentNode && div.parentNode.removeChild(div);
                                }
                            }
                        };
                        waitData();
                    }
                }
            });
    }
}
