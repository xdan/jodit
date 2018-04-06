/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Confirm, Dialog} from '../modules/Dialog';
import {
    isHTML, browser, htmlspecialchars, isHTMLFromWord, applyStyles, dom,
    cleanFromWord, isIE, type, trim
} from '../modules/Helpers';
import {Config} from '../Config';
import {INSERT_AS_HTML, INSERT_AS_TEXT, INSERT_CLEAR_HTML, INSERT_ONLY_TEXT, TEXT_HTML, TEXT_PLAIN} from "../constants";
import {ControlType} from "../modules/ToolbarCollection";

/**
 * @property{boolean} askBeforePasteHTML=true Ask before paste HTML in WYSIWYG mode
 */
declare module "../Config" {
    interface Config {
        askBeforePasteHTML: boolean;
        askBeforePasteFromWord: boolean;
        defaultActionOnPaste: string;
    }
}

Config.prototype.askBeforePasteHTML = true;
Config.prototype.askBeforePasteFromWord = true;
Config.prototype.defaultActionOnPaste =  INSERT_AS_HTML;

Config.prototype.controls.cut = <ControlType>{
    command: 'cut',
    isDisable: (editor: Jodit) => {
        const sel: Selection = editor.editorWindow.getSelection();
        return !sel || sel.isCollapsed;
    },
    tooltip: 'Cut selection'
};

/**
 * Ask before paste HTML source
 *
 * @module insertHTML
 */
export function paste(editor: Jodit) {
    let buffer: string = '';

    const strip_tags: Function = (html: string): string => {
        const div: HTMLDivElement = document.createElement('div');
        div.innerHTML = html;
        return div.innerText;
    };

    const ClearOrKeep: Function = (msg: string, title: string, callback: (yes: boolean | number) => void, clearButton: string = 'Clean', clear2Button: string = 'Insert only Text'): Dialog | void => {
        if (editor.events && editor.events.fire('beforeOpenPasteDialog', msg, title, callback, clearButton, clear2Button) === false) {
            return;
        }

        const dialog: Dialog = Confirm(`<div style="word-break: normal; white-space: normal">${msg}</div>`, title, callback);
        dialog.dialogbox.setAttribute('data-editor_id', editor.id);

        const keep: HTMLAnchorElement  = <HTMLAnchorElement>dom(
            '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
            '<span>' + editor.i18n('Keep') + '</span>' +
            '</a>',
            dialog.document
        );

        const clear: HTMLAnchorElement  = <HTMLAnchorElement>dom(
            '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
            '<span>' + editor.i18n(clearButton) + '</span>' +
            '</a>',
            dialog.document
        );

        const clear2: HTMLAnchorElement  = <HTMLAnchorElement>dom(
            '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
            '<span>' + editor.i18n(clear2Button) + '</span>' +
            '</a>',
            dialog.document
        );

        const cancel: HTMLAnchorElement  = <HTMLAnchorElement>dom(
            '<a href="javascript:void(0)" style="float:right;" class="jodit_button">' +
            '<span>' + editor.i18n('Cancel') + '</span>' +
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

        editor.events && editor.events.fire('afterOpenPasteDialog', dialog, msg, title, callback, clearButton, clear2Button);

        return dialog;
    };

    const insertByType = (html: string, type: string) => {
        switch (type) {
            case INSERT_CLEAR_HTML:
                html = cleanFromWord(html);
                break;
            case INSERT_ONLY_TEXT:
                html = strip_tags(html);
                break;
            case INSERT_AS_TEXT:
                html = htmlspecialchars(html);
                break;
            default:
        }

        editor.selection.insertHTML(html);
    };

    const insertHTML: Function = (html: string, event: DragEvent | ClipboardEvent) : void | false => {
        if (isHTML(html) && buffer !== trimFragment(html)) {

            editor.events.stopPropagation('beforePaste');

            html = trimFragment(html);
            ClearOrKeep(editor.i18n('Your code is similar to HTML. Keep as HTML?'), editor.i18n('Paste as HTML'), (agree: boolean | number) => {
                let insertType: string = INSERT_AS_HTML;
                if (agree === false) {
                    insertType = INSERT_AS_TEXT;
                }

                if (agree === 0) {
                    insertType = INSERT_ONLY_TEXT;
                }

                if (event.type === 'drop') {
                    editor.selection.insertCursorAtPoint((<DragEvent>event).clientX, (<DragEvent>event).clientY);
                }

                insertByType(html, insertType);

                editor.setEditorValue();
            }, 'Insert as Text');
            return false;
        }
    };

    const trimFragment = (html: string): string => {
        const start: number = html.search(/<!--StartFragment-->/i);
        if (start !== -1) {
            html = html.substr(start + 20);
        }

        const end: number = html.search(/<!--EndFragment-->/i);
        if (end !== -1) {
            html = html.substr(0, end);
        }

        return html;
    };

    const getDataTransfer = (event: ClipboardEvent | DragEvent) : DataTransfer => {
        if ((<ClipboardEvent>event).clipboardData) {
            return (<ClipboardEvent>event).clipboardData;
        }

        return (<DragEvent>event).dataTransfer;
    };

    editor.events
        .on('copy cut', (event: ClipboardEvent): false | void => {
            const selectedText: string = editor.selection.getHTML();

            const clipboardData: DataTransfer = getDataTransfer(event) || getDataTransfer(<any>editor.editorWindow) || getDataTransfer((<any>event).originalEvent);


            clipboardData.setData(TEXT_PLAIN, strip_tags(selectedText));
            clipboardData.setData(TEXT_HTML, selectedText);

            buffer = selectedText;

            if (event.type === 'cut') {
                editor.selection.remove();
                editor.selection.focus();
            }

            event.preventDefault();

            editor.events.fire('afterCopy', selectedText);
        })
        .on('paste', (event: ClipboardEvent | DragEvent): false | void => {

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

            if (event && getDataTransfer(event)) {
                let i: number,
                    types: string[] = getDataTransfer(event).types,
                    types_str: string = '',
                    clipboard_html: any = '';

                if (Array.isArray(types) || type(types) === 'domstringlist') {
                    for (i = 0; i < types.length; i += 1) {
                        types_str += types[i] + ";";
                    }
                } else {
                    types_str = types;
                }

                if (/text\/html/i.test(types_str)) {
                    clipboard_html = getDataTransfer(event).getData("text/html");
                } else if (/text\/rtf/i.test(types_str) && browser('safari')) {
                    clipboard_html = getDataTransfer(event).getData("text/rtf");
                } else if (/text\/plain/i.test(types_str) && !browser('mozilla')) {
                    clipboard_html = getDataTransfer(event).getData(TEXT_PLAIN);
                } else if (/text/i.test(types_str) && isIE) {
                    clipboard_html = getDataTransfer(event).getData(TEXT_PLAIN);
                }

                if (clipboard_html instanceof (<any>editor.editorWindow).Node || trim(clipboard_html) !== '') {
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

                    clipboard_html = trimFragment(clipboard_html);

                    if (buffer !== clipboard_html) {
                        clipboard_html = editor.events.fire('processPaste', event, clipboard_html);
                    }

                    if (typeof clipboard_html === 'string' || clipboard_html instanceof (<any>editor.editorWindow).Node) {
                        if (event.type === 'drop') {
                            editor.selection.insertCursorAtPoint((<DragEvent>event).clientX, (<DragEvent>event).clientY);
                        }

                        insertByType(clipboard_html, editor.options.defaultActionOnPaste);
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

    if (editor.options.askBeforePasteHTML) {
        editor.events
            .on('beforePaste', (event: ClipboardEvent | DragEvent): false | void => {
                if (event && getDataTransfer(event).getData(TEXT_PLAIN)) {
                    let html: string = getDataTransfer(event).getData(TEXT_PLAIN);
                    return insertHTML(html, event);
                }
            });
    }

    if (editor.options.askBeforePasteFromWord) {
        editor.events
            .on('beforePaste', (event: ClipboardEvent): false | void => {
                if (event && getDataTransfer(event).getData && getDataTransfer(event).getData(TEXT_HTML)) {
                    const processHTMLData: Function = (html: string): void | false => {
                        if (isHTML(html) && buffer !== trimFragment(html)) {
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
                                insertHTML(html, event);
                            }
                            return false;
                        }
                    };

                    if (getDataTransfer(event).types && [].slice.call(getDataTransfer(event).types).indexOf("text/html") !== -1) {
                        const html: string = getDataTransfer(event).getData(TEXT_HTML);
                        return processHTMLData(html);
                    } else if (event.type !== 'drop') {
                        const div: HTMLDivElement = <HTMLDivElement>dom('<div tabindex="-1" style="left: -9999px; top: 0; width: 0; height: 100%; line-height: 140%; overflow: hidden; position: fixed; z-index: 2147483647; word-break: break-all;" contenteditable="true"></div>', editor.ownerDocument);
                        editor.container.appendChild(div);
                        const selData = editor.selection.save();
                        div.focus();
                        let tick: number = 0;

                        const removeFakeFocus = () => {
                            div.parentNode && div.parentNode.removeChild(div);
                            editor.selection.restore(selData);
                        };

                        const waitData: Function = () => {
                            tick += 1;
                            // If data has been processes by browser, process it
                            if (div.childNodes && div.childNodes.length > 0) {
                                const pastedData: string = div.innerHTML;
                                removeFakeFocus();
                                if (processHTMLData(pastedData) !== false) {
                                    editor.selection.insertHTML(pastedData);
                                }
                            } else {
                                if (tick < 5) {
                                    setTimeout(function () {
                                        waitData()
                                    }, 20);
                                } else {
                                    removeFakeFocus();
                                }
                            }
                        };
                        waitData();
                    }
                }
            });
    }
}
