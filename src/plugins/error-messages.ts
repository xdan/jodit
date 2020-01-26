/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2020 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { Config } from '../Config';
import { Dom } from '../modules/Dom';
import { css } from '../modules/helpers';
import { IJodit } from '../types';

declare module '../Config' {
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
export function errorMessages(editor: IJodit) {
	if (editor.options.showMessageErrors) {
		let height: number;

		const messagesBox: HTMLDivElement = editor.create.div(
				'jodit_error_box_for_messages'
			),
			recalcOffsets = () => {
				height = 5;
				Array.from(<NodeListOf<HTMLElement>>(
					messagesBox.childNodes
				)).forEach((elm: HTMLElement) => {
					css(messagesBox, 'bottom', height + 'px');

					height +=
						elm.offsetWidth +
						editor.options.showMessageErrorOffsetPx;
				});
			};

		/**
		 * Вывести всплывающее сообщение внизу редактора
		 *
		 * @event errorMessage
		 * @param {string} message  Сообщение
		 * @param {string} className Дополнительный класс собобщения. Допускаются info, error, success
		 * @param {string} timeout Сколько миллисекунд показывать. По умолчанию используется
		 * options.showMessageErrorTime = 2000
		 * @example
		 * ```javascript
		 * parent.events.fire('errorMessage', 'Error 123. File has not been upload');
		 * parent.events.fire('errorMessage', 'You can upload file', 'info', 4000);
		 * parent.events.fire('errorMessage', 'File was uploaded', 'success', 4000);
		 * ```
		 */
		editor.events
			.on('beforeDestruct', () => {
				Dom.safeRemove(messagesBox);
			})
			.on(
				'errorMessage',
				(message: string, className: string, timeout: number) => {
					editor.workplace.appendChild(messagesBox);

					const newmessage = editor.create.div(
						'active ' + (className || ''),
						message
					);

					messagesBox.appendChild(newmessage);

					recalcOffsets();

					editor.async.setTimeout(() => {
						newmessage.classList.remove('active');

						editor.async.setTimeout(() => {
							Dom.safeRemove(newmessage);
							recalcOffsets();
						}, 300);
					}, timeout || editor.options.showMessageErrorTime);
				}
			);
	}
}
