import Jodit from '../jodit';
import config from '../config'
import * as consts from '../constants';
import {dom,each} from '../modules/Helpers'
/**
 * Show placeholder
 *
 * @module Placeholder
 * @params {Object} parent Jodit main object
 */

/**
 * @property {boolean} showPlaceholder=true Show placeholder
 * @memberof module:Placeholder
 * @example
 * var editor = new Jodit('#editor', {
 *    showPlaceholder: false
 * });
 */
config.showPlaceholder = true;

/**
 * @property {boolean} useInputsPlaceholder=true use a placeholder from original input field, if it was set
 * @memberof module:Placeholder
 * @example
 * //<textarea id="editor" placeholder="start typing text ..." cols="30" rows="10"></textarea>
 * var editor = new Jodit('#editor', {
 *    useInputsPlaceholder: true
 * });
 */
config.useInputsPlaceholder = true;

/**
 * @property {string} placeholder='Type something' Default placeholder
 * @memberof module:Placeholder
 * @example
 * var editor = new Jodit('#editor', {
 *    placeholder: 'start typing text ...'
 * });
 */
config.placeholder = 'Type something';

Jodit.plugines.placeholder = function (parent) {
    let placeholder, timeout;
    this.destruct  = () => {
        placeholder.parentNode.removeChild(placeholder);
        clearTimeout(timeout);
    };
    const show =  () => {
            let marginTop = 0, marginLeft = 0, paddingTop = 0, paddingLeft = 0;
            let style = parent.win.getComputedStyle(parent.editor);

            if (parent.editor.firstChild && parent.editor.firstChild.nodeType === Node.ELEMENT_NODE) {
                let style2 = parent.win.getComputedStyle(parent.editor.firstChild);
                marginTop = parseInt(style2.getPropertyValue('margin-top'), 10);
                marginLeft = parseInt(style2.getPropertyValue('margin-left'), 10);
                paddingTop = parseInt(style2.getPropertyValue('padding-top'), 10);
                paddingLeft = parseInt(style2.getPropertyValue('padding-left'), 10);
                placeholder.style.fontSize = parseInt(style2.getPropertyValue('font-size'), 10) + 'px';
                placeholder.style.lineHeight = style2.getPropertyValue('line-height');
            } else {
                placeholder.style.fontSize = parseInt(style.getPropertyValue('font-size'), 10) + 'px';
                placeholder.style.lineHeight = style.getPropertyValue('line-height');
            }


            each({
                display: 'block',
                marginTop: Math.max(parseInt(style.getPropertyValue('margin-top'), 10), marginTop),
                paddingTop: Math.max(parseInt(style.getPropertyValue('padding-top'), 10), paddingTop),
                paddingLeft: Math.max(parseInt(style.getPropertyValue('padding-left'), 10), paddingLeft),
                marginLeft: Math.max(parseInt(style.getPropertyValue('margin-left'), 10), marginLeft)
            }, (key, value) => {
                placeholder.style[key] = value;
            })
        },
        hide = function () {
            placeholder.style.display = 'none';
        },
        toggle = () => {
            if (!parent.editor) {
                return;
            }
            if (parent.getMode() !== consts.MODE_WYSIWYG) {
                return hide();
            }
            if (parent.getEditorValue()) {
                hide();
            } else {
                show();
            }
        };

    placeholder = dom('<span class="jodit_placeholder">' + parent.i18n(parent.options.placeholder) + '</span>');

    if (parent.options.useInputsPlaceholder && parent.element.hasAttribute('placeholder')) {
        placeholder.innerHTML = parent.element.getAttribute('placeholder');
    }

    parent.workplace
        .appendChild(placeholder);

    show();

    parent.events.on('change  keyup mouseup keydown mousedown  afterSetMode', () => {
        toggle();
        timeout = setTimeout(toggle, 1)
    });
}
