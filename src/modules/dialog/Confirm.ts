/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import { Dialog } from './Dialog';
import { Jodit } from '../../Jodit';
import { dom } from '../helpers/Helpers';
import { ToolbarIcon } from '..';

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
        $div: HTMLDivElement = dom(
            '<form class="jodit_promt"></form>',
            dialog.document
        ) as HTMLDivElement,
        $label: HTMLLabelElement = dom(
            '<label></label>',
            dialog.document
        ) as HTMLLabelElement;

    if (typeof title === 'function') {
        callback = title;
        title = undefined;
    }

    $label.appendChild(dom(msg, dialog.document));
    $div.appendChild($label);

    const $cancel: HTMLAnchorElement = dom(
        '<a href="javascript:void(0)" style="float:right;" class="jodit_button">' +
            ToolbarIcon.getIcon('cancel') +
            '<span>' +
            Jodit.prototype.i18n('Cancel') +
            '</span>' +
            '</a>',
        dialog.document
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

    const $ok: HTMLAnchorElement = dom(
        '<a href="javascript:void(0)" style="float:left;" class="jodit_button">' +
            ToolbarIcon.getIcon('check') +
            '<span>' +
            Jodit.prototype.i18n('Yes') +
            '</span>' +
            '</a>',
        dialog.document
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

(Jodit as any).Confirm = Confirm;
