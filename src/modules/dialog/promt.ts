/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */
import { Dialog } from './dialog';
import { ToolbarIcon } from '../toolbar/icon';

/**
 * Show `promt` dialog. Work without Jodit object
 *
 * @method Promt
 * @param {string} msg Message
 * @param {string|function} [title] Title or callback
 * @param {function} [callback] callback. The first argument is the value entered
 * @param {string} [placeholder] Placeholder for input
 * @example
 * ```javascript
 * Jodit.Promt("Enter your name", "Promt Dialog", function (name) {
 *     if (name.length < 3) {
 *         Jodit.Alert("The name must be at least 3 letters");
 *         return false;
 *     }
 *     // do something
 * });
 * ```
 */
export const Promt = (
    msg: string,
    title: string | (() => false | void) | undefined,
    callback: (value: string) => false | void,
    placeholder?: string
): Dialog => {
    const dialog: Dialog = new Dialog(),
        $cancel: HTMLAnchorElement = dialog.create.fromHTML(
            '<a href="javascript:void(0)" style="float:right;" class="jodit_button">' +
                ToolbarIcon.getIcon('cancel') +
                '<span>' +
                Jodit.prototype.i18n('Cancel') +
                '</span></a>'
        ) as HTMLAnchorElement,
        $ok: HTMLAnchorElement = dialog.create.fromHTML(
            '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
                ToolbarIcon.getIcon('check') +
                '<span>' +
                Jodit.prototype.i18n('Ok') +
                '</span></a>'
        ) as HTMLAnchorElement,
        $div: HTMLFormElement = dialog.create.element('form', {
            class: 'jodit_promt',
        }),
        $input: HTMLInputElement = dialog.create.element('input', {
            autofocus: true,
        }),
        $label: HTMLLabelElement = dialog.create.element(
            'label'
        ) as HTMLLabelElement;

    if (typeof title === 'function') {
        callback = title;
        title = undefined;
    }

    if (placeholder) {
        $input.setAttribute('placeholder', placeholder);
    }

    $label.appendChild(dialog.create.text(msg));

    $div.appendChild($label);
    $div.appendChild($input);

    $cancel.addEventListener('click', dialog.close, false);

    const onclick = () => {
        if (
            !callback ||
            typeof callback !== 'function' ||
            callback($input.value) !== false
        ) {
            dialog.close();
        }
    };

    $ok.addEventListener('click', onclick);

    $div.addEventListener('submit', () => {
        onclick();
        return false;
    });

    dialog.setFooter([$ok, $cancel]);

    dialog.open($div, (title as string) || '&nbsp;', true, true);
    $input.focus();

    return dialog;
};

import { Jodit } from '../../Jodit';
