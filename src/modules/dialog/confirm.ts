/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */

import { Dialog } from './dialog';
import { ToolbarIcon } from '../toolbar/icon';

/**
 * Show `confirm` dialog. Work without Jodit object
 *
 * @method Confirm
 * @param {string} msg Message
 * @param {string|function} [title] Title or callback
 * @param {function} [callback] callback. The first argument is the value entered
 * @example
 * ```javascript
 * Jodit.Confirm("Are you shure?", "Confirm Dialog", function (yes) {
 *     if (yes) {
 *         // do something
 *     }
 * });
 * ```
 */
export const Confirm = (
    msg: string,
    title: string | ((yes: boolean) => void) | undefined,
    callback?: (yes: boolean) => void
): Dialog => {
    const dialog = new Dialog(),
        $div: HTMLDivElement = dialog.create.fromHTML(
            '<form class="jodit_promt"></form>'
        ) as HTMLDivElement,
        $label: HTMLLabelElement = dialog.create.element('label');

    if (typeof title === 'function') {
        callback = title;
        title = undefined;
    }

    $label.appendChild(dialog.create.fromHTML(msg));
    $div.appendChild($label);

    const $cancel: HTMLAnchorElement = dialog.create.fromHTML(
        '<a href="javascript:void(0)" style="float:right;" class="jodit_button">' +
            ToolbarIcon.getIcon('cancel') +
            '<span>' +
            Jodit.prototype.i18n('Cancel') +
            '</span>' +
            '</a>'
    ) as HTMLAnchorElement;

    $cancel.addEventListener('click', () => {
        if (callback) {
            callback(false);
        }
        dialog.close();
    });

    const onok = () => {
        if (callback) {
            callback(true);
        }
        dialog.close();
    };

    const $ok: HTMLAnchorElement = dialog.create.fromHTML(
        '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
            ToolbarIcon.getIcon('check') +
            '<span>' +
            Jodit.prototype.i18n('Yes') +
            '</span>' +
            '</a>'
    ) as HTMLAnchorElement;

    $ok.addEventListener('click', onok);

    $div.addEventListener('submit', () => {
        onok();
        return false;
    });

    dialog.setFooter([$ok, $cancel]);

    dialog.open($div, (title as string) || '&nbsp;', true, true);
    $ok.focus();

    return dialog;
};

import { Jodit } from '../../Jodit';
