/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Config } from '../Config';
import * as consts from '../constants';
import { css } from '../modules/helpers/css';
import { debounce } from '../modules/helpers/async';
import { Dom } from '../modules/Dom';
import { IJodit } from '../types';

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
declare module '../Config' {
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

/**
 * Show placeholder inside empty editor
 *
 * @param {Jodit} editor
 */
export function placeholder(this: any, editor: IJodit) {
    if (!editor.options.showPlaceholder) {
        return;
    }

    (this as any).destruct = () => {
        Dom.safeRemove(placeholderElm);
    };

    const show = () => {
            if (!placeholderElm.parentNode || editor.options.readonly) {
                return;
            }

            let marginTop: number = 0,
                marginLeft: number = 0;

            const style: CSSStyleDeclaration = editor.editorWindow.getComputedStyle(
                editor.editor
            );

            if (
                editor.editor.firstChild &&
                editor.editor.firstChild.nodeType === Node.ELEMENT_NODE
            ) {
                const style2: CSSStyleDeclaration = editor.editorWindow.getComputedStyle(
                    editor.editor.firstChild as Element
                );
                marginTop = parseInt(style2.getPropertyValue('margin-top'), 10);
                marginLeft = parseInt(
                    style2.getPropertyValue('margin-left'),
                    10
                );
                placeholderElm.style.fontSize =
                    parseInt(style2.getPropertyValue('font-size'), 10) + 'px';
                placeholderElm.style.lineHeight = style2.getPropertyValue(
                    'line-height'
                );
            } else {
                placeholderElm.style.fontSize =
                    parseInt(style.getPropertyValue('font-size'), 10) + 'px';
                placeholderElm.style.lineHeight = style.getPropertyValue(
                    'line-height'
                );
            }

            css(placeholderElm, {
                display: 'block',
                marginTop: Math.max(
                    parseInt(style.getPropertyValue('margin-top'), 10),
                    marginTop
                ),
                marginLeft: Math.max(
                    parseInt(style.getPropertyValue('margin-left'), 10),
                    marginLeft
                ),
            });
        },
        hide = () => {
            if (placeholderElm.parentNode) {
                placeholderElm.style.display = 'none';
            }
        },
        toggle = debounce(() => {
            if (placeholderElm.parentNode === null) {
                return;
            }

            if (!editor.editor) {
                return;
            }

            if (editor.getRealMode() !== consts.MODE_WYSIWYG) {
                return hide();
            }

            const value: string = editor.getEditorValue();

            if (value && !/^<(p|div|h[1-6])><\/\1>$/.test(value)) {
                hide();
            } else {
                show();
            }
        }, editor.defaultTimeout / 10);

    const placeholderElm: HTMLElement = editor.create.fromHTML(
        '<span style="display: none;" class="jodit_placeholder">' +
            editor.i18n(editor.options.placeholder) +
            '</span>'
    );

    if (editor.options.direction === 'rtl') {
        placeholderElm.style.right = '0px';
        placeholderElm.style.direction = 'rtl';
    }

    if (
        editor.options.useInputsPlaceholder &&
        editor.element.hasAttribute('placeholder')
    ) {
        placeholderElm.innerHTML =
            editor.element.getAttribute('placeholder') || '';
    }

    editor.events
        .on('readonly', (isReadOnly: boolean) => {
            if (isReadOnly) {
                hide();
            } else {
                toggle();
            }
        })
        .on('afterInit', () => {
            editor.workplace.appendChild(placeholderElm);

            toggle();

            editor.events.fire('placeholder', placeholderElm.innerHTML);
            editor.events
                .on(
                    'change keyup mouseup keydown mousedown afterSetMode',
                    toggle
                )
                .on(window, 'load', toggle);
        });
}
