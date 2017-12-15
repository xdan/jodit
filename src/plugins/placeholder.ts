/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2017 Valeriy Chupurnov xdsoft.net
 */

import Jodit from '../Jodit';
import {Config} from '../Config'
import * as consts from '../constants';
import {dom,each} from '../modules/Helpers'
/**
 * Show placeholder
 *
 */

/**
 * @property {boolean} showPlaceholder=true Show placeholder
 * @example
 * ```javascript
 * var editor = new Jodit('#editor', {
 *    showPlaceholder: false
 * });
 * ```
 */
declare module "../Config" {
    interface Config {
        showPlaceholder: boolean;
        useInputsPlaceholder: boolean;
        placeholder: string;
    }
}
Config.prototype.showPlaceholder = true;

/**
 * @property {boolean} useInputsPlaceholder=true use a placeholder from original input field, if it was set
 * @example
 * ```javascript
 * //<textarea id="editor" placeholder="start typing text ..." cols="30" rows="10"></textarea>
 * var editor = new Jodit('#editor', {
 *    useInputsPlaceholder: true
 * });
 * ```
 */
Config.prototype.useInputsPlaceholder = true;

/**
 * @property {string} placeholder='Type something' Default placeholder
 * @example
 * ```javascript
 * var editor = new Jodit('#editor', {
 *    placeholder: 'start typing text ...'
 * });
 * ```
 */
Config.prototype.placeholder = 'Type something';

export function placeholder(editor: Jodit) {
    let placeholder: HTMLElement,
        timeout;

    if (!editor.options.showPlaceholder) {
        return;
    }

    this.destruct  = () => {
        placeholder.parentNode.removeChild(placeholder);
        clearTimeout(timeout);
    };

    const show =  () => {
            let marginTop: number = 0,
                marginLeft: number = 0;

            const style: CSSStyleDeclaration = editor.editorWindow.getComputedStyle(editor.editor);

            if (editor.editor.firstChild && editor.editor.firstChild.nodeType === Node.ELEMENT_NODE) {
                const style2:CSSStyleDeclaration = editor.editorWindow.getComputedStyle(<Element>editor.editor.firstChild);
                marginTop = parseInt(style2.getPropertyValue('margin-top'), 10);
                marginLeft = parseInt(style2.getPropertyValue('margin-left'), 10);
                placeholder.style.fontSize = parseInt(style2.getPropertyValue('font-size'), 10) + 'px';
                placeholder.style.lineHeight = style2.getPropertyValue('line-height');
            } else {
                placeholder.style.fontSize = parseInt(style.getPropertyValue('font-size'), 10) + 'px';
                placeholder.style.lineHeight = style.getPropertyValue('line-height');
            }


            each({
                display: 'block',
                marginTop: Math.max(parseInt(style.getPropertyValue('margin-top'), 10), marginTop),
                marginLeft: Math.max(parseInt(style.getPropertyValue('margin-left'), 10), marginLeft)
            }, (key, value) => {
                placeholder.style[key] = value;
            })
        },
        hide = function () {
            placeholder.style.display = 'none';
        },
        toggle = () => {
            if (!editor.editor) {
                return;
            }
            if (editor.getRealMode() !== consts.MODE_WYSIWYG) {
                return hide();
            }
            if (editor.getEditorValue()) {
                hide();
            } else {
                show();
            }
        };



    placeholder = dom('<span class="jodit_placeholder">' + editor.i18n(editor.options.placeholder) + '</span>', editor.ownerDocument);

    if (editor.options.useInputsPlaceholder && editor.element.hasAttribute('placeholder')) {
        placeholder.innerHTML = editor.element.getAttribute('placeholder');
    }

    editor.events
        .on('afterInit', () => {
            editor.workplace
                .appendChild(placeholder);

            show();
            editor.events.fire('placeholder', [placeholder.innerHTML]);
        })
        .on('change keyup mouseup keydown mousedown afterSetMode', () => {
            toggle();
            timeout = setTimeout(toggle, 1)
        });
}
