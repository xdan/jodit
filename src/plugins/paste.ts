/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import {
    INSERT_AS_HTML,
    INSERT_AS_TEXT,
    INSERT_CLEAR_HTML,
    INSERT_ONLY_TEXT,
    IS_IE,
    TEXT_HTML,
    TEXT_PLAIN,
} from '../constants';

import { Confirm, Dialog } from '../modules/dialog/';

import {
    applyStyles,
    browser,
    cleanFromWord,
    htmlspecialchars,
    isHTML,
    isHTMLFromWord,
    trim,
    type,
    setTimeout,
    stripTags,
} from '../modules/helpers/';

import { IControlType } from '../types/toolbar';
import { Dom } from '../modules/Dom';
import { IJodit } from '../types';

declare module '../Config' {
    interface Config {
        /**
         * @property askBeforePasteHTML=true Ask before paste HTML in WYSIWYG mode
         */
        askBeforePasteHTML: boolean;
        askBeforePasteFromWord: boolean;
        /**
         * Default insert method
         */
        defaultActionOnPaste: string;
    }
}

Config.prototype.askBeforePasteHTML = true;
Config.prototype.askBeforePasteFromWord = true;
Config.prototype.defaultActionOnPaste = INSERT_AS_HTML;

Config.prototype.controls.cut = {
    command: 'cut',
    isDisable: (editor: IJodit) => {
        const sel: Selection = editor.selection.sel;
        return !sel || sel.isCollapsed;
    },
    tooltip: 'Cut selection',
} as IControlType;

/**
 * Ask before paste HTML source
 *
 * @module insertHTML
 */
export function paste(editor: IJodit) {
    let buffer: string = '';

    const clearOrKeep = (
        msg: string,
        title: string,
        callback: (yes: boolean | number) => void,
        clearButton: string = 'Clean',
        clear2Button: string = 'Insert only Text'
    ): Dialog | void => {
        if (
            editor.events &&
            editor.events.fire(
                'beforeOpenPasteDialog',
                msg,
                title,
                callback,
                clearButton,
                clear2Button
            ) === false
        ) {
            return;
        }

        const dialog: Dialog = Confirm(
            `<div style="word-break: normal; white-space: normal">${msg}</div>`,
            title,
            callback
        );

        dialog.container.setAttribute('data-editor_id', editor.id);

        const keep: HTMLAnchorElement = dialog.create.fromHTML(
            '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
                '<span>' +
                editor.i18n('Keep') +
                '</span>' +
                '</a>'
        ) as HTMLAnchorElement;

        const clear: HTMLAnchorElement = dialog.create.fromHTML(
            '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
                '<span>' +
                editor.i18n(clearButton) +
                '</span>' +
                '</a>'
        ) as HTMLAnchorElement;

        const clear2: HTMLAnchorElement = dialog.create.fromHTML(
            '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
                '<span>' +
                editor.i18n(clear2Button) +
                '</span>' +
                '</a>'
        ) as HTMLAnchorElement;

        const cancel: HTMLAnchorElement = dialog.create.fromHTML(
            '<a href="javascript:void(0)" style="float:right;" class="jodit_button">' +
                '<span>' +
                editor.i18n('Cancel') +
                '</span>' +
                '</a>'
        ) as HTMLAnchorElement;

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

        dialog.setFooter([keep, clear, clear2Button ? clear2 : '', cancel]);

        editor.events &&
            editor.events.fire(
                'afterOpenPasteDialog',
                dialog,
                msg,
                title,
                callback,
                clearButton,
                clear2Button
            );

        return dialog;
    };

    const insertByType = (html: string, subtype: string) => {
        switch (subtype) {
            case INSERT_CLEAR_HTML:
                html = cleanFromWord(html);
                break;
            case INSERT_ONLY_TEXT:
                html = stripTags(html);
                break;
            case INSERT_AS_TEXT:
                html = htmlspecialchars(html);
                break;
            default:
        }

        editor.selection.insertHTML(html);
    };

    const insertHTML = (
        html: string,
        event: DragEvent | ClipboardEvent
    ): void | false => {
        if (isHTML(html) && buffer !== trimFragment(html)) {
            editor.events.stopPropagation('beforePaste');

            html = trimFragment(html);
            clearOrKeep(
                editor.i18n('Your code is similar to HTML. Keep as HTML?'),
                editor.i18n('Paste as HTML'),
                (agree: boolean | number) => {
                    let insertType: string = INSERT_AS_HTML;
                    if (agree === false) {
                        insertType = INSERT_AS_TEXT;
                    }

                    if (agree === 0) {
                        insertType = INSERT_ONLY_TEXT;
                    }

                    if (event.type === 'drop') {
                        editor.selection.insertCursorAtPoint(
                            (event as DragEvent).clientX,
                            (event as DragEvent).clientY
                        );
                    }

                    insertByType(html, insertType);

                    editor.setEditorValue();
                },
                'Insert as Text'
            );
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

    const getDataTransfer = (
        event: ClipboardEvent | DragEvent
    ): DataTransfer => {
        if ((event as ClipboardEvent).clipboardData) {
            return (event as ClipboardEvent).clipboardData;
        }

        return (event as DragEvent).dataTransfer || new DataTransfer();
    };

    editor.events
        .on(
            'copy cut',
            (event: ClipboardEvent): false | void => {
                const selectedText: string = editor.selection.getHTML();

                const clipboardData: DataTransfer =
                    getDataTransfer(event) ||
                    getDataTransfer(editor.editorWindow as any) ||
                    getDataTransfer((event as any).originalEvent);

                clipboardData.setData(TEXT_PLAIN, stripTags(selectedText));
                clipboardData.setData(TEXT_HTML, selectedText);

                buffer = selectedText;

                if (event.type === 'cut') {
                    editor.selection.remove();
                    editor.selection.focus();
                }

                event.preventDefault();

                editor.events.fire('afterCopy', selectedText);
            }
        )
        .on(
            'paste',
            (event: ClipboardEvent | DragEvent): false | void => {
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
                    const types:
                        | ReadonlyArray<string>
                        | string = getDataTransfer(event).types;

                    let i: number,
                        types_str: string = '',
                        clipboard_html: any = '';

                    if (
                        Array.isArray(types) ||
                        type(types) === 'domstringlist'
                    ) {
                        for (i = 0; i < types.length; i += 1) {
                            types_str += types[i] + ';';
                        }
                    } else {
                        types_str = types.toString();
                    }

                    if (/text\/html/i.test(types_str)) {
                        clipboard_html = getDataTransfer(event).getData(
                            'text/html'
                        );
                    } else if (
                        /text\/rtf/i.test(types_str) &&
                        browser('safari')
                    ) {
                        clipboard_html = getDataTransfer(event).getData(
                            'text/rtf'
                        );
                    } else if (
                        /text\/plain/i.test(types_str) &&
                        !browser('mozilla')
                    ) {
                        clipboard_html = getDataTransfer(event).getData(
                            TEXT_PLAIN
                        );
                    } else if (/text/i.test(types_str) && IS_IE) {
                        clipboard_html = getDataTransfer(event).getData(
                            TEXT_PLAIN
                        );
                    }

                    if (
                        clipboard_html instanceof
                            (editor.editorWindow as any).Node ||
                        trim(clipboard_html) !== ''
                    ) {
                        /**
                         * Triggered after the content is pasted from the clipboard into the Jodit.
                         * If a string is returned the new string will be used as the pasted content.
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
                            clipboard_html = editor.events.fire(
                                'processPaste',
                                event,
                                clipboard_html
                            );
                        }

                        if (
                            typeof clipboard_html === 'string' ||
                            clipboard_html instanceof
                                (editor.editorWindow as any).Node
                        ) {
                            if (event.type === 'drop') {
                                editor.selection.insertCursorAtPoint(
                                    (event as DragEvent).clientX,
                                    (event as DragEvent).clientY
                                );
                            }

                            insertByType(
                                clipboard_html,
                                editor.options.defaultActionOnPaste
                            );
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
            }
        );

    if (editor.options.askBeforePasteHTML) {
        editor.events.on(
            'beforePaste',
            (event: ClipboardEvent | DragEvent): false | void => {
                if (event && getDataTransfer(event).getData(TEXT_PLAIN)) {
                    const html: string = getDataTransfer(event).getData(
                        TEXT_PLAIN
                    );
                    return insertHTML(html, event);
                }
            }
        );
    }

    if (editor.options.askBeforePasteFromWord) {
        editor.events.on(
            'beforePaste',
            (event: ClipboardEvent): false | void => {
                if (
                    event &&
                    getDataTransfer(event).getData &&
                    getDataTransfer(event).getData(TEXT_HTML)
                ) {
                    const processHTMLData = (html: string): void | false => {
                        if (isHTML(html) && buffer !== trimFragment(html)) {
                            if (isHTMLFromWord(html)) {
                                clearOrKeep(
                                    editor.i18n(
                                        'The pasted content is coming from a Microsoft Word/Excel document. ' +
                                            'Do you want to keep the format or clean it up?'
                                    ),
                                    editor.i18n('Word Paste Detected'),
                                    (agree: boolean | number) => {
                                        if (agree === true) {
                                            html = applyStyles(html);

                                            if (
                                                editor.options.beautifyHTML &&
                                                (editor.ownerWindow as any)
                                                    .html_beautify
                                            ) {
                                                html = (editor.ownerWindow as any).html_beautify(
                                                    html
                                                );
                                            }
                                        }

                                        if (agree === false) {
                                            html = cleanFromWord(html);
                                        }

                                        if (agree === 0) {
                                            html = stripTags(
                                                cleanFromWord(html)
                                            );
                                        }

                                        editor.selection.insertHTML(html);
                                        editor.setEditorValue();
                                    }
                                );
                            } else {
                                insertHTML(html, event);
                            }
                            return false;
                        }
                    };

                    if (
                        getDataTransfer(event).types &&
                        Array.from(getDataTransfer(event).types).indexOf(
                            'text/html'
                        ) !== -1
                    ) {
                        const html: string = getDataTransfer(event).getData(
                            TEXT_HTML
                        );
                        return processHTMLData(html);
                    } else if (event.type !== 'drop') {
                        const div: HTMLDivElement = editor.create.div(void 0, {
                            tabindex: -1,
                            contenteditable: true,
                            style: {
                                left: -9999,
                                top: 0,
                                width: 0,
                                height: '100%',
                                lineHeight: '140%',
                                overflow: 'hidden',
                                position: 'fixed',
                                zIndex: 2147483647,
                                wordBreak: 'break-all',
                            },
                        });

                        editor.container.appendChild(div);

                        const selData = editor.selection.save();

                        div.focus();
                        let tick: number = 0;

                        const removeFakeFocus = () => {
                            Dom.safeRemove(div);
                            editor.selection.restore(selData);
                        };

                        const waitData = () => {
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
                                    setTimeout(waitData, 20);
                                } else {
                                    removeFakeFocus();
                                }
                            }
                        };

                        waitData();
                    }
                }
            }
        );
    }
}
