import Jodit from '../Jodit';
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
* @prop {boolean} showMessageErrors=true
* @memberof Jodit.defaultOptions
*/
Config.prototype.showMessageErrors = true;
/**
* @prop {int} showMessageErrorTime=3000 How long show messages
* @memberof Jodit.defaultOptions
*/
Config.prototype.showMessageErrorTime = 3000;

/**
* @prop {int} showMessageErrorOffsetPx=3 Offset fo message
* @memberof Jodit.defaultOptions
*/
Config.prototype.showMessageErrorOffsetPx = 3;

/**
 * Plugin to display pop-up messages in the lower right corner of the editor
 *
 * @module ErrorMessages
 */
Jodit.plugins.errorMessages = function (editor: Jodit) {
    if (editor.options.showMessageErrors) {
        let height: number;
        const messagesBox: HTMLDivElement = <HTMLDivElement>dom('<div class="jodit_error_box_for_messages"></div>'),
            recalcOffsets = function () {
                height = 5;
                [].slice.call(messagesBox.childNodes).forEach(function (elm) {
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
         * parent.events.fire('errorMessage', ['Error 123. File has not been upload']);
         * parent.events.fire('errorMessage', ['You can upload file', 'info', 4000]);
         * parent.events.fire('errorMessage', ['File was uploaded', 'success', 4000]);
         */
        editor.events.on('errorMessage', (message: string, className: string, timeout: number) => {
            const newmessage: HTMLDivElement = <HTMLDivElement>dom('<div class="active ' + (className || '') + '">' + message + '</div>');
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
};