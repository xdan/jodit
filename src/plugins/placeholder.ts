/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Config} from '../Config'
import * as consts from '../constants';
import {css, debounce, dom} from '../modules/Helpers'
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


/**
 * Show placeholder inside empty editor
 *
 * @param {Jodit} editor
 */
export function placeholder(this: any, editor: Jodit) {
    if (!editor.options.showPlaceholder) {
        return;
    }

    (<any>this).destruct  = () => {
        if (placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
        }
    };

    const show =  () => {
            if (!placeholder.parentNode || editor.options.readonly) {
                return;
            }

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

            css(placeholder, {
                display: 'block',
                marginTop: Math.max(parseInt(style.getPropertyValue('margin-top'), 10), marginTop),
                marginLeft: Math.max(parseInt(style.getPropertyValue('margin-left'), 10), marginLeft)
            })
        },
        hide = function () {
            if (placeholder.parentNode) {
                placeholder.style.display = 'none';
            }
        },
        toggle = debounce(() => {
            if (placeholder.parentNode === null) {
                return;
            }

            if (!editor.editor) {
                return;
            }
            if (editor.getRealMode() !== consts.MODE_WYSIWYG) {
                return hide();
            }
            let value: string = editor.getEditorValue();
            if (value && !/^<(p|div|h[1-6])><\/\1>$/.test(value)) {
                hide();
            } else {
                show();
            }
        }, editor.defaultTimeout / 10);



    const placeholder: HTMLElement = dom('<span style="display: none;" class="jodit_placeholder">' + editor.i18n(editor.options.placeholder) + '</span>', editor.ownerDocument);

    if (editor.options.direction === 'rtl') {
        placeholder.style.right = '0px';
        placeholder.style.direction = 'rtl';
    }

    if (editor.options.useInputsPlaceholder && editor.element.hasAttribute('placeholder')) {
        placeholder.innerHTML = editor.element.getAttribute('placeholder') || '';
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
            editor.workplace
                .appendChild(placeholder);

            toggle();

            editor.events.fire('placeholder', placeholder.innerHTML);
            editor.events
                .on('change keyup mouseup keydown mousedown afterSetMode', toggle)
                .on(window, 'load', toggle);
        })

}
