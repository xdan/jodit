/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * License https://xdsoft.net/jodit/license.html
 * Copyright 2013-2018 Valeriy Chupurnov https://xdsoft.net
 */

import {Jodit} from '../Jodit';
import {Config} from '../Config'
import {css, dom} from "../modules/Helpers";

declare module "../Config" {
    interface Config {
        showMessageErrors: boolean;
        showMessageErrorTime: number;
        showMessageErrorOffsetPx: number;
    }
}

/**
* @property{boolean} showMessageErrors=true
*/
Config.prototype.showMessageErrors = true;
/**
* @property{int} showMessageErrorTime=3000 How long show messages
*/
Config.prototype.showMessageErrorTime = 3000;

/**
* @property{int} showMessageErrorOffsetPx=3 Offset fo message
*/
Config.prototype.showMessageErrorOffsetPx = 3;

/**
 * Plugin toWYSIWYG display pop-up messages in the lower right corner of the editor
 */
export function errorMessages(editor: Jodit) {
    if (editor.options.showMessageErrors) {
        let height: number;
        const messagesBox: HTMLDivElement = <HTMLDivElement>dom('<div class="jodit_error_box_for_messages"></div>', editor.ownerDocument),
            recalcOffsets = function () {
                height = 5;
                [].slice.call(messagesBox.childNodes).forEach((elm: HTMLElement) => {
                    css(messagesBox, 'bottom', height + 'px');
                    height += elm.offsetWidth + editor.options.showMessageErrorOffsetPx;
                });
            };
        editor.workplace.appendChild(messagesBox);

        /**
         * Вывести всплывающее сообщение внизу редактора
         *
         * @event errorMessage
         * @param {string} message  Сообщение
         * @param {string} className Дополнительный класс собобщения. Допускаются info, error, success
         * @param {string} timeout Сколько миллисекунд показывать. По умолчанию используется options.showMessageErrorTime = 2000
         * @example
         * ```javascript
         * parent.events.fire('errorMessage', 'Error 123. File has not been upload');
         * parent.events.fire('errorMessage', 'You can upload file', 'info', 4000);
         * parent.events.fire('errorMessage', 'File was uploaded', 'success', 4000);
         * ```
         */
        editor.events.on('errorMessage', (message: string, className: string, timeout: number) => {
            const newmessage: HTMLDivElement = <HTMLDivElement>dom('<div class="active ' + (className || '') + '">' + message + '</div>', editor.ownerDocument);
            messagesBox.appendChild(newmessage);
            recalcOffsets();
            setTimeout(() => {
                newmessage.classList.remove('active');
                setTimeout(() => {
                    messagesBox.removeChild(newmessage);
                    recalcOffsets();
                }, 300);
            }, timeout || editor.options.showMessageErrorTime);
        });
    }
}