/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License GNU General Public License version 2 or later;
 * Copyright 2013-2019 Valeriy Chupurnov https://xdsoft.net
 */
import { Dialog } from './dialog';
import { ToolbarIcon } from '../toolbar/icon';

/**
 * Show `alert` dialog. Work without Jodit object
 *
 * @method Alert
 * @param {string} msg Message
 * @param {string|function} [title] Title or callback
 * @param {function} [callback] callback
 * @param {string} [className]
 * @example
 * ```javascript
 * Jodit.Alert("File was uploaded");
 * Jodit.Alert("File was uploaded", "Message");
 * Jodit.Alert("File was uploaded", function() {
 *    $('form').hide();
 * });
 * Jodit.Alert("File wasn't uploaded", "Error", function() {
 *    $('form').hide();
 * });
 * ```
 */
export const Alert = (
    msg: string | HTMLElement,
    title?: string | (() => void | false),
    callback?: string | ((dialog: Dialog) => void | false),
    className: string = 'jodit_alert'
): Dialog => {
    if (typeof title === 'function') {
        callback = title;
        title = undefined;
    }

    const dialog: Dialog = new Dialog(),
        $div: HTMLDivElement = dialog.create.div(className),
        $ok: HTMLAnchorElement = dialog.create.fromHTML(
            '<a href="javascript:void(0)" style="float:right;" class="jodit_button">' +
                ToolbarIcon.getIcon('cancel') +
                '<span>' +
                Jodit.prototype.i18n('Ok') +
                '</span></a>'
        ) as HTMLAnchorElement;

    asArray(msg).forEach(oneMessage => {
        $div.appendChild(
            Dom.isNode(oneMessage, dialog.window) ? oneMessage : dialog.create.fromHTML(oneMessage)
        );
    });

    $ok.addEventListener('click', () => {
        if (
            !callback ||
            typeof callback !== 'function' ||
            callback(dialog) !== false
        ) {
            dialog.close();
        }
    });

    dialog.setFooter([$ok]);

    dialog.open($div, (title as string) || '&nbsp;', true, true);
    $ok.focus();

    return dialog;
};

import { Jodit } from '../../Jodit';
import { asArray } from '../helpers/array';
import { Dom } from '../Dom';
