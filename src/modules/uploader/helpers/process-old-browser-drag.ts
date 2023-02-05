/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2023 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 * @module modules/uploader
 */

import type { HandlerError, HandlerSuccess, IUploader } from 'jodit/types';
import { TEXT_PLAIN } from 'jodit/core/constants';
import { getContainer } from 'jodit/core/global';
import { attr, isJoditObject } from 'jodit/core/helpers';
import { Dom } from 'jodit/core/dom';
import { dataURItoBlob, sendFiles } from './index';

export function processOldBrowserDrag(
	self: IUploader,
	cData: DataTransfer | null,
	handlerSuccess?: HandlerSuccess,
	handlerError?: HandlerError,
	onFinally?: () => void
): void {
	if (cData && (!cData.types.length || cData.types[0] !== TEXT_PLAIN)) {
		const div = self.j.c.div('', {
			tabindex: -1,
			style:
				'left: -9999px; top: 0; width: 0; height: 100%;line-height: 140%; ' +
				'overflow: hidden; position: fixed; z-index: 2147483647; word-break: break-all;',
			contenteditable: true
		});

		getContainer(self.j, self.constructor).appendChild(div);

		const selection = isJoditObject(self.j) ? self.j.s.save() : null,
			restore = (): void | null | boolean =>
				selection && isJoditObject(self.j) && self.j.s.restore();

		div.focus();

		self.j.async.setTimeout(() => {
			const child: HTMLDivElement | null =
				div.firstChild as HTMLDivElement;

			Dom.safeRemove(div);

			if (child && child.hasAttribute('src')) {
				const src = attr(child, 'src') || '';

				restore();

				sendFiles(
					self,
					[dataURItoBlob(src) as File],
					handlerSuccess,
					handlerError
				).finally(onFinally);
			}
		}, self.j.defaultTimeout);
	}
}
