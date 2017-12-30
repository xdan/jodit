/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Confirm} from '../modules/Dialog';
import {isHTML, browser, htmlentities, htmlspecialchars} from '../modules/Helpers';
import {Config} from '../Config'
import {TEXT_PLAIN} from "../constants";

/**
 * @property{boolean} askBeforePasteHTML=true Ask before paste HTML in WYSIWYG mode
 */
declare module "../Config" {
    interface Config {
        askBeforePasteHTML: boolean;
    }
}
Config.prototype.askBeforePasteHTML = true;

/**
 * Ask before paste HTML source
 *
 * @module insertHTML
 */
export function paste(editor: Jodit) {
    editor.events.on('afterInit', () => {
        editor.editor.addEventListener('paste', (event: ClipboardEvent) => {
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

        if (editor.events.fire('beforePaste', [event]) === false) {
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

                clipboard_html = editor.events.fire('processPaste', [event, clipboard_html]);

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
        if (editor.events.fire('afterPaste', [event]) === false) {
            return false;
        }
    });
    });
    if (editor.options.askBeforePasteHTML) {
        editor.events.on('beforePaste', (event: ClipboardEvent) => {
            if (event && event.clipboardData && event.clipboardData.getData && event.clipboardData.types[0] === TEXT_PLAIN) {
                let html = event.clipboardData.getData(TEXT_PLAIN);
                if (isHTML(html)) {
                    Confirm(editor.i18n('Your code is similar to HTML. Paste as HTML?'), editor.i18n('Paste as HTML'), (agree) => {
                        if (agree) {
                            editor.selection.insertHTML(html);
                        } else {
                            editor.selection.insertHTML(htmlspecialchars(html));
                        }
                        editor.setEditorValue();
                    });
                    return false;
                }
            }
        });
    }
}
